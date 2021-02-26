import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {fetchMatch, makeQueryString} from "../helper";
import {Connection} from "typeorm";
import {IMatchFromApi} from '../entity/entity.type';
import {PrismaService} from '../service/prisma.service';
import fetch from 'node-fetch';
import {IReplayResult} from './replay.type';
import {uniq} from 'lodash';
import {InjectS3, S3} from 'nestjs-s3';
import {formatDayAndTime, sleep} from '../util';
import {fromUnixTime, getUnixTime, subMinutes} from "date-fns";

let workerCount = 0;

@Injectable()
export class ReplayTask implements OnModuleInit {
    private readonly logger = new Logger(ReplayTask.name);

    private matches: IMatchFromApi[] = [];
    private pending: string[] = [];

    // private apiUrl = 'http://0.0.0.0:80/replay';
    private apiUrl = 'http://95.217.215.149:80/replay';
    // private apiUrl = 'http://195.201.24.178:80/replay';
    // private apiUrl = 'https://wzhlh6g7h8.execute-api.eu-central-1.amazonaws.com/Prod/hello/';

    constructor(
        private connection: Connection,
        private prisma: PrismaService,
        @InjectS3() private readonly s3: S3,
    ) {
    }

    async onModuleInit() {
        this.runIngest1();

        for (let i = 0; i < 10; i++) {
            this.runWorker(workerCount++);
            await sleep(2500);
        }

        // try {
        //     const list = await this.s3.listBuckets().promise();
        //     console.log('buckets', list.Buckets);
        // } catch (e) {
        //     console.log(e);
        // }
    }

    async fetchFromAoe2Net(match: IMatchFromApi) {
        let updatedMatch = await fetchMatch('aoe2de', {
            uuid: match.match_uuid,
            match_id: match.match_id
        });
        if (updatedMatch) {
            if (updatedMatch.finished) {
                if (updatedMatch.players.some(p => p.won)) {
                    await this.prisma.match.update({
                        where: {
                            match_id: match.match_id,
                        },
                        data: {
                            finished: updatedMatch.finished,
                        },
                    });
                    for (const player of updatedMatch.players) {
                        const existingPlayer = match.players.find(p => p.slot == player.slot);
                        await this.prisma.player.update({
                            where: {
                                match_id_profile_id_slot: {
                                    match_id: match.match_id,
                                    profile_id: existingPlayer.profile_id,
                                    slot: existingPlayer.slot,
                                },
                            },
                            data: {
                                won: player.won,
                            },
                        });
                    }
                    console.log('FETCH FROM AOE2NET', 'UPDATED');
                } else {
                    console.log('FETCH FROM AOE2NET', 'NO WINNER');
                }
            } else {
                console.log('FETCH FROM AOE2NET', 'UNFINISHED');
            }
        } else {
            console.log('FETCH FROM AOE2NET', '404');
        }
    }

    async runWorker(workerNum: number) {
        let error = false;
        const match = this.matches.shift();
        if (match != null) {
            this.pending.push(match.match_id);
            try {
                await this.doWork(workerNum, match);
            } catch (e) {
                error = true;
            }
            this.pending.splice(this.pending.indexOf(match.match_id), 1);
        }
        setTimeout(() => this.runWorker(workerNum), error ? 60 * 1000 : 1000);
    }

    async doWork(workerNum: number, match: IMatchFromApi) {
        console.log();
        console.log(formatDayAndTime(fromUnixTime(match.started)));
        // console.log(formatDayAndTime(fromUnixTime(match.finished)));
        console.log(`WORKER ${workerNum}...`);

        // try {
            const hasAtLeastOneWinnerAndDefeatedPlayer = match.players.some(p => p.won === true) && match.players.some(p => p.won === false);
            if (!hasAtLeastOneWinnerAndDefeatedPlayer) {
                await this.fetchFromAoe2Net(match);
            }
        // } catch (e) {
        //     this.pending.splice(this.pending.indexOf(match.match_id), 1);
        //     setTimeout(() => this.runWorker(workerNum), 60 * 1000);
        //     return;
        // }

        // Only replay ranked matches
        if (![1, 2, 3, 4].includes(match.leaderboard_id)) {
            console.log('STATE', 2000, ((match.finished - match.started) / 60).toFixed() + 'min');
            await this.prisma.match.update({
                where: {
                    match_id: match.match_id,
                },
                data: {
                    replayed: 2000,
                },
            });
            return;
        }

        let replayResult: IReplayResult = {
            status: 404,
            replay: null,
        };
        for (const player of match.players.filter(p => p.profile_id)) {
            console.time(`WORKER ${workerNum} - ${match.match_id} ${player.profile_id}`);

            const replayExists = await this.existsReplay(match.match_id, player.profile_id);
            if (!replayExists) continue;

            // try {
                replayResult = await this.processReplay(match.match_id, player.profile_id);
            // } catch (e) {
            //     setTimeout(() => this.runWorker(workerNum), 60 * 1000);
            //     return;
            // }
            // console.log('replayResult', replayResult);
            // console.log('replayResult', JSON.stringify(replayResult));

            if (replayResult.replay) break;

            console.timeEnd(`WORKER ${workerNum} - ${match.match_id} ${player.profile_id}`);
        }

        if (replayResult.replay == null) {
            console.log('STATE', replayResult.status, ((match.finished - match.started) / 60).toFixed() + 'min');
            await this.prisma.match.update({
                where: {
                    match_id: match.match_id,
                },
                data: {
                    replayed: replayResult.status,
                },
            });
            return;
        }

        const aoe2netWinnerAllSame = uniq(match.players.map(p => p.won)).length == 1;

        let unknownWinner = false;
        let shouldUpdateWinner = true;
        let winnerMismatch = false;

        // console.log('replayResult', replayResult);
        // console.log('players', replayResult.replay.players);

        for (const replayPlayer of replayResult.replay.players) {
            // const existingWinner = match.players.find(p => p.profile_id == replayPlayer.user_id).won;
            const existingWinner = match.players.find(p => p.slot == replayPlayer.number).won;
            if (existingWinner != null && existingWinner != replayPlayer.winner) {
                winnerMismatch = true;
            }
            if (existingWinner != null) {
                shouldUpdateWinner = false;
            }
            if (replayPlayer.winner == null) {
                unknownWinner = true;
            }
        }

        let allWinnerSame = uniq(replayResult.replay.players.map(p => p.winner)).length === 1;

        const duration = replayResult.replay.duration;

        let state = 1;

        if (allWinnerSame) {
            console.log('STATE', '1000 - all winner same');
            state = 1000;
        } else if (unknownWinner) {
            console.log('STATE', '999 - unknown winner');
            state = 999;
        } else if (winnerMismatch && !aoe2netWinnerAllSame) {
            console.log('STATE', '777 - winner mismatch');
            state = 777;
        } else if (!shouldUpdateWinner) {
            console.log('STATE', '2 - winner already set');
            state = 2;
        }

        console.log('STATE', state);

        replayResult.replay.players.forEach(v => delete v.achievements);

        await this.s3.putObject({
            Bucket: 'match.aoe2companion.com',
            ContentType: 'application/json',
            Key: `${match.match_id}.json`,
            Body: JSON.stringify(replayResult.replay),
            ACL: 'public-read',
        }).promise();

        // if (replayResult.replay.restored[0]) {
        //     console.log('RESTORED');
        //     await this.s3.putObject({
        //         Bucket: 'aoe2companion',
        //         ContentType: 'application/json',
        //         Key: `parsed-match-restored/${match.match_id}.json`,
        //         Body: JSON.stringify(replayResult.replay),
        //         ACL: 'public-read',
        //     }).promise();
        // }

        await this.prisma.match.update({
            where: {
                match_id: match.match_id,
            },
            data: {
                duration,
                duration_minutes: Math.round((duration / 1000 / 60) * 100) / 100,
                replayed: state,
                finished: match.finished ?? match.started + Math.round(duration / 1000),
            },
        });

        if (state == 1) {
            // if (match.players.filter(p => p.profile_id == 0).length > 0) {
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            //     console.log('==> WITH PC', match.match_id);
            // }

            for (const replayPlayer of replayResult.replay.players) {
                // const existingPlayer = match.players.find(p => p.profile_id == replayPlayer.user_id);
                const existingPlayer = match.players.find(p => p.slot == replayPlayer.number);
                await this.prisma.player.update({
                    where: {
                        match_id_profile_id_slot: {
                            match_id: match.match_id,
                            profile_id: existingPlayer.profile_id,
                            slot: existingPlayer.slot,
                        },
                    },
                    data: {
                        won: replayPlayer.winner,
                    },
                });
            }
        }
    }

    async incrementAwsUsage(timeInMs: number, bandwidthInBytes: number) {
        // await this.prisma.$queryRaw`UPDATE key_value SET value = (value::int+${timeInMs})::int::text::jsonb WHERE id = 'awsTimeInMs';`;
        // await this.prisma.$queryRaw`UPDATE key_value SET value = (value::int+${bandwidthInBytes})::int::text::jsonb WHERE id = 'awsBandwidthInBytes';`;
        // await this.prisma.$queryRaw`UPDATE key_value SET value = (value::float+${timeInMs * 2 / 1000})::float::text::jsonb WHERE id = 'awsTimeInSeconds';`;
        // await this.prisma.$queryRaw`UPDATE key_value SET value = (value::float+${bandwidthInBytes / 1000000})::float::text::jsonb WHERE id = 'awsBandwidthInMB';`;
        // await this.prisma.$queryRaw`UPDATE key_value SET value = (value::int+1)::int::text::jsonb WHERE id = 'awsInvocations';`;
    }

    // awsTimeInMs
    // awsBandwidthInBytes

    async processReplay(match_id: string, profile_id: number) {
        let query: any = {
            match_id,
            profile_id,
        };
        const queryString = makeQueryString(query);
        const url = `${this.apiUrl}?${queryString}`;
        console.log(url);

        let textLength = 0;
        const start = new Date();

        const response = await fetch(url, {timeout: 60 * 1000});
        try {
            // if (response.status == 502) {
            //     const text = await response.text();
            //     if (text.includes("Internal server error")) {
            //         return {
            //             status: 800, // Probably timeout
            //             replay: null,
            //         };
            //     }
            // }
            if (response.status != 200) {
                try {
                    const jsonStr = await response.text();
                    console.log('ERROR: ', match_id, profile_id, jsonStr);
                    await this.s3.putObject({
                        Bucket: 'match.aoe2companion.com',
                        ContentType: 'application/json',
                        Key: `${match_id}.json`,
                        Body: jsonStr,
                        ACL: 'public-read',
                    }).promise();
                } catch (e) {
                }
                return {
                    status: response.status,
                    replay: null,
                };
            }

            const text = await response.text();
            textLength = text.length;
            // console.log(text);
            // await this.incrementAwsUsage(new Date().getTime() - start.getTime(), textLength);
            const replay = JSON.parse(text);

            if (replay.error) {
                console.log('ERROR: ', match_id, profile_id, replay.error);
                // await this.incrementAwsUsage(new Date().getTime() - start.getTime(), textLength);
                return {
                    status: -1,
                    replay: null,
                };
            }

            return {
                status: response.status,
                replay,
            };
            // return await response.json();
        } catch (e) {
            console.log("FAILED", url);
            // await this.incrementAwsUsage(new Date().getTime() - start.getTime(), textLength);
            return {
                status: -1,
                replay: null,
            };
            // throw e;
        }
    }

    async existsReplay(match_id: string, profile_id: number) {
        const url = `https://aoe.ms/replay/?gameId=${match_id}&profileId=${profile_id}`;
        console.log('HEAD', url);
        const response = await fetch(url, {
            method: 'HEAD',
            timeout: 60 * 1000,
        });
        return response.status == 200;
    }

    async runIngest1() {
        const oneHourAgo = subMinutes(new Date(), 60);

        if (this.matches.length == 0) {
            console.log("Pending", this.pending);

            // const matches = await this.prisma.match.findMany({
            //     include: {
            //         players: true,
            //     },
            //     where: {
            //         match_id: {
            //             in:
            //                 ['67492030']
            //             // ['66942255','66922177','66903376','66895742','66784934','66775290','66766145','66632822','66617219','66607376','66583958','66571428','66492719','66352915','66123007','66112606','66101746','66093218','65880645','65852877','65577092','65576689','64750953','64745791','64735937','64730735','63306891','63297882','63113363','63091817','63056026','63041316','63028648','62867184','62857342','62808530','62784707','62774088','62759096','62748325','62743459','62738780','62734717','61728402','61675095','61656831','61640847','61564688','61563555','61550584','61545518','61542429','61387844','61371985','61359239','61343434','59010969','58951834','58945733','58942198','58938481','56401605','56398422','56391531','56384734','56091052','56080801','55940014','55931162','55909674','55345148','54953105','54906844','54902029','54896296','52675454','52458562','52454659','52449565','52444985','52442844','51922962','51917360','51912845','51907095','47668309','43844516','43838599','43698746','43697927','43691274','43686337','43664138','43661153','43655751','43547059','43544100','43507241','43505174','43123375','43111893','43093602','43089170','43085317','42600138','38292915','38292414','38287180','38282658','38281934','37681757','36980076','35876991','35874014','35703521','35697331','35614814','35552179','35547346','35544876','35444252','35443933','35389850','35377708','35347622','35345697','34308745','34305698','34301166','34295792','34294997','34290327','33477848','33474351','33466173','33378146','33374562','33118036','33117003','33113299','33107273','33105192','33102809','33097706','33093739','33091034','33057856','33055933','33008683','33007714','33004742','33002175','33000674','32887450','32885136','32869857','32858157','32853710','32793169','32776768','32772468','32634687','32502990','32499583','32494849','32490230','32390894','32388117','32382981','32375021','32369888','32207185','32201372','32184716','32182260','31967285','31966688','31962280','31717795','31714885','31691910','31511138','31509444','31506023','31459456','31455618','31452197']
            //             // ['66987287','66986466','66942255','66922177','66903376','66895742','66632822','66617219','66607376','66492719','66483943','66478215','66472712','66352915','66343365','66336049','66332087','66330608','66317454','66112606','66101746','66086632','65880645','65852877','65375472','65253014','65251233','65243144','65235171','65123415','65047173','65039783','65030252','65020742','65011335','65001283','64831958','64700560','64695902','64668419','64665581','64662832','64027056','64022644','63827718','63522859','63516866','63513088','63510355','63505753','63302080','63113363','63046919','63038022','62968643','62962141','62957770','62774088','62759096','62748325','62743459','62738232','62521391','62517137','62195348','62187758','62175753','62172941','61826617','61819057','61814061','61810163','61806730','61652539','61628858','61411200','61304381','61297587','61286244','61285182','61262358','61257886','61024223','61018494','60786429','60784365','59763841','59752180','59747528','59735648','59726340','55081020','55079791','55071712','54241760','54238481','54235337','54232609','53682530','53674355','53666633','53505304','53267450','53110817','53108583','53106815','53105691','52946673','52941954','52746255','52564821','52114881','52111908','52104963','51891230','51880584','51871561','51632985','51625017','51614179','51217554','51214269','51111291','51104919','51094813','50837336','50693902','50683276','50680177','50671652','50664880','50327111','50318368','50305519','50300262','50296218','50287472','50279378','50264113','49765152','49762209','49760866','49756649','49753004','48978706','48968758','48959463','48952664','48514997','48508321','48501445','48495933','48492088','48491089','48328446','48325774','48322464','48316036','48314635','48308421','48306032','48303888','48164049','48159939','48155715','48147974','47690339','47426415','47422434','47417720','47411397','47407868','47383868','47271018','47261908','47253247','47208792','47204226','47201354','47197946','47063299','47058200','47052422','47051817','47045991','46894155','46887663','46884507','46881141','46757636','46753293','46636992','46630237','46625258','46616352','46349081','46348148','46345930','46342671','46341710','46338605','46202823','46196155','46189826','46181870','46172941','46168853','46049508','46042747','46034826','46030139','45998565','45995542','45990551','45984199','45815153','45801050','45798069','45657854','45654147','45653470','45649239','45510581','45505080','45504234','45495613','45488294','45401861','45393994','45383018','45379197','45257092','45250087','45248753','45022269','45018345','45011663','45006797','45001748','44995996','44871845','44781432','44776853','44773924','44771162','44705923','44674571','44670405','44669510','44664487','44656315','44621742','44547798','44534681','44485762','44481698','44446775','44396359','44367322','44356832','44356218','44350007','44301610','44242710','44226769','44215298','44157856','44142767','44090757','43520610','43516643','43513525','43398551','43392850','43387764','43383558','42547068','42543382','41721336','41640798','41638624','41637757','41631693','41625975','41073593','41067508','41064180','40583494','40577271','40570171','40343953','40341646','40106101','40099567','40095465','40090133','39979214','39973320','39932949','39928578','39835012','39832202','39828286','39806041','39801386','39797824','39794308','39685559','39684711','39679189','39643093','39642256','39641048','39634987','39421906','39420819','39417812','39410849','39283970','39132076','39124621','39120235','38992441','38985373','38978830','38974334','37492604','37491966','37487061','37483145','37482186','35696301','35694033','35693391','35692862','35687736','35685157','35681353','33555277','33310429','33307723','33307568','33118036','33117003','33113299','33071832','33071185','33044878','33043306','33043069','32589674','32583088','32582942','32582641','32582123','31270368','31198266','31193830','31159708','30954003','30949102','30810111','30806784','30806012','30804783','30800773','30796371','30791021','30789114','30369668','30365116','30261566','30257278','30256856','29915711','29911025','29906771','29902725','29901858','29900838','29805102','29794347','29787050','29782629','29776382','29734322','29732064','29727966','29583044','29581877','29581370','29577992','29577555','29574105','29459659','29454943','29449610','29440868','29319023','29316014','29315239','29313141','29310960','29310603','29258951','28966116','28961494','28960052','28957595','28956195','28953246','28952730','28951058','28948760','28849616','28844508','28807938','28806815','28803037','28798423','28666392','28664837','28661061','28535391','28532672','28527568','28508412','28051793','28048243','28043212','28017992','27033873','27029446','27027869','27027430','27026906','27026645','26885415','26885032','26880922','26879772','26658132','26655223','26654678','26527312','26524331','26029143','26025517','26021432','26017941','25742836','25742033','25734153','25729320','25725553','25722387','25488426','25484619','25480565','25353836','25352039','25269423','25263558','25220021','24553459','21291807','21283151','20994128','20983799','20975757','20971730','20964786','20960332','20950150','20721114','20715671','20575642','20542541','20534924','20340571','20337304','20333933','20328743','20323964','20320413','20196078','20189917','20185460','20181226','20037016','20035972','20030023','20020622','19864351','19859866','19854567','19714534','19700697','19257399','19244049','18877118','18872707','18588332','18581003','18577218','18568037','18564737','18426646','18422595','18418671','18359638','18356682','18242073','18223571','18165117','18159384','18154319','18005265','17996605','17992258','17868120','17856676','17848727','17826336','17720014','17680077','17643327','17589131','17562219','17555137','17543545','17538317','17532012','17493127','17488776','17486552','17423410','17420360','17408775','17403149','17363688','17357805','17355672','17315698','17229754','17217877','17215083','17189725','17179571','17176639','17173596','16978102','16756268','16747445','16737477','16731903','16728149','16723871','16626366','16575833','16571724','16565367','16560445','16431137','16422988','16415873','16311467','16304490','16293917','16285338','16104728','16096115','16091116','16082558','15923620','15916874','15913878','15908017','15643328','15639735','15637322','15633632','15629300','15487757','15477735','15471127','15467970','15445924','15440742','15435644','15361995','15330529','15323648','15313041','15130397','15124168','15118214','14983046','14974549','14970260','14964392','14871587','14867142','14861711','14855614','14831790','14823712','14820427','14814745','14728030','14675459','14666870','14658296','14619616','14615654','14609289','14603800','14521199','14405500','14400935','14393717','14314775','14295437','14286690','14274153','14268532','14130929','14118960','14108630','13997981','13897532','13848437','13838758','13816399','13808374','13802062','13709578','13686408','13685710','13675264','13666284','13483578','13471858','13440075','13425465','13268358','13260037','13081495','13050613','13042174','13007260','12878464','12876723','12875885','12871851','12714775','12712549','12710289','12631504','12589561','12585134','12580623','12575825','12439305','12433129','12431700','12430337','12424843','12419864','12418019','12413583','12348754','12282866','12274496','12270951','12212678','11956847','11953283','11844363','11843645','11838332','11705183','11676495','11672576','11667761','11542658','11541491','11467587','11372151','11195148','11190533','11186738','11157487','11059130','11053652','11023990','10960834','10956769','10956096','10953926','10952610','10889813','10716524','10713586','10700680','10698282','10657612','10647183','10643598','10629256','10566336','10561644','10556956','10511799','10306766','10184811','10182968','10179760','9921083','9920595','9752350','9745674','9256724','9250912','9246091','9111751','9036407','9033267','9029239','9024691','8951103','8947034','8944361','8941236','8792947','8788745','8759792','8725569','8719907','8683255','8681633','8664712','8647115','8645034','8638279','8633123','8631405','8583867','8580385','8517579','8495054','8491325','8489758','8413639','8413452','8411805','8410394','8307597','8304941','8301684','8299199','8244984','7930598','7837903','7689333','7235528','7231441','6950924','6665353','6607900','6603220','6545308']
            //         },
            //         replayed: null,
            //     },
            //     take: 10,
            //     orderBy: {
            //         started: 'desc',
            //     },
            // }) as any as IMatchFromApi[];
            const matches = await this.prisma.match.findMany({
                include: {
                    players: true,
                },
                where: {
                    // finished: {not: null},
                    started: {lt: getUnixTime(oneHourAgo)},
                    replayed: null,
                },
                take: 100,
                orderBy: {
                    started: 'desc',
                },
            }) as any as IMatchFromApi[];
            this.matches = matches.filter(m => !this.pending.includes(m.match_id));
            console.log(this.matches.map(m => m.match_id));
        }

        setTimeout(() => this.runIngest1(), 5 * 1000);
    }
}
