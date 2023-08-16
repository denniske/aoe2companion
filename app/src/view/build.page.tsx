import React from 'react';
import {Image, ScrollView, StyleSheet, View} from "react-native";
import {createStylesheet} from "../theming-new";
import {MyText} from "./components/my-text";
import {fakeBuild, IBuildOrderStep} from "../../../data/src/helper/builds";
import {getBuildingIcon} from "../helper/buildings";
import {getOtherIcon, getUnitIcon} from "../helper/units";
import {getTechIcon} from "../helper/techs";

function getBuildingIconInternal(building: string) {
    //     return getBuildingIcon(capitalize(building) as any);
    return getBuildingIcon(building as any);
}

function getTaskIconInternal(task: string) {
    if (task === 'wood') {
        return getOtherIcon('Wood');
    }
    if (task === 'food') {
        return getOtherIcon('Food');
    }
    if (task === 'gold') {
        return getOtherIcon('Gold');
    }
    if (task === 'stone') {
        return getOtherIcon('Stone');
    }
    if (task === 'boar') {
        return getUnitIcon('Boar');
    }
    if (task === 'sheep') {
        return getUnitIcon('Sheep');
    }
    if (task === 'farm') {
        return getBuildingIcon('Farm');
    }
    if (task === 'berries') {
        return getOtherIcon('BerryBush');
    }
    return getBuildingIcon('House');
}

interface IResourceAllocProps {
    resource: string;
    count: number;
}

function ResourceAlloc(props: IResourceAllocProps) {
    const styles = useStyles();
    const { resource, count } = props;
    return (
        <View style={styles.row}>
            <Image source={getOtherIcon(resource as any)} style={styles.picSmall}/>
            <MyText style={styles.resourceCount}>{count}</MyText>
        </View>
    );
}

function Step(props: IBuildOrderStep) {
    const styles = useStyles();
    const { type, from, to, tech, buildings, task, count, resources } = props;
    return (
      <View style={styles.step}>
          <View style={styles.actions}>
              {
                  buildings?.map((building, i) =>
                    <View key={i} style={styles.buildingRow}>
                        <MyText>{i > 0 ? '+ ': ''}</MyText>
                        {/*<MyText>{building.count > 1 ? building.count : ''}</MyText>*/}
                        {/*<Image source={getBuildingIconInternal(building.type)} style={styles.buildingPic}/>*/}
                        {
                            Array(building.count).fill(0).map(x =>
                                <Image source={getBuildingIconInternal(building.type)} style={styles.buildingPic}/>
                            )
                        }
                    </View>
                  )
              }
              {
                  tech?.map((tech, i) =>
                    <View key={i} style={styles.buildingRow}>
                        <MyText>{i > 0 ? '+ ': ''}</MyText>
                        <Image source={getTechIcon(capitalize(tech) as any)} style={styles.buildingPic}/>
                    </View>
                  )
              }
              {/*{*/}
              {/*    buildings &&*/}
              {/*    <MyText>+</MyText>*/}
              {/*}*/}
              {
                  type == 'newVillagers' &&
                  <View style={styles.row}>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''}{count} →</MyText>
                      <Image source={getTaskIconInternal(task as any)} style={task === 'berries' ? styles.pic2 : styles.pic}/>
                  </View>
              }
              {
                  type == 'moveVillagers' &&
                  <View style={styles.row}>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''}{count}</MyText>
                      <Image source={getTaskIconInternal(from as any)} style={from === 'berries' ? styles.pic2 : styles.pic}/>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''} →</MyText>
                      <Image source={getTaskIconInternal(to as any)} style={to === 'berries' ? styles.pic2 : styles.pic}/>
                  </View>
              }
              {
                  type == 'trainUnit' &&
                  <View style={styles.row}>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''}Start training {props.unit}</MyText>
                  </View>
              }
              {
                  type == 'ageUp' &&
                  <View style={styles.row}>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''}Research</MyText>
                      <Image source={getOtherIcon(capitalize(props.age!) as any)} style={styles.pic}/>
                  </View>
              }
              {
                  type == 'newAge' &&
                  <View style={styles.row}>
                      <MyText style={styles.workerText}>{buildings ? '+ ' : ''}Entered</MyText>
                      <Image source={getOtherIcon(capitalize(props.age!) as any)} style={styles.pic}/>
                  </View>
              }
          </View>
          {
              (type == 'newVillagers' || type == 'moveVillagers') &&
              <View style={styles.villagers}>
                  <ResourceAlloc resource="Wood" count={resources.wood}/>
                  <ResourceAlloc resource="Food" count={resources.food}/>
                  <ResourceAlloc resource="Gold" count={resources.gold}/>
              </View>
          }
      </View>
    );
}

// console.log('Render step with number ' + index + ' -> ' + JSON.stringify(step))
// if (step.type === 'newAge') this.currentGroup = null
//
// let title = BuildData.getTitleForStep(step)
// if (this.currentGroup !== null && this.state.width > 629) title = '• ' + title
// const age = step.age === undefined ? null : BuildData.getAgeText(step.age)
//
// if (step.type === 'ageUp' && index+1 < this.props.build.length) {
//     this.currentGroup = age
// }
//
// return (
//     <div>
//         {step.type !== 'newAge' && <div className="buildOrderOverviewListItemWrapper" id={"buildOrderOverviewListItemWithIndex" + index} onClick={this.handleClick.bind(this, index)}>
//             {step.type !== 'newAge' && <span className={"buildOrderOverviewListItemTitle"}>{title}</span>}
//             {(step.type === 'newVillagers' || step.type === 'moveVillagers' || step.type === 'collectGold') && <BuildDashboard skipNullValues={true} food={step.resources.food} builder={step.resources.build} wood={step.resources.wood} stone={step.resources.stone} showGold={showGold} showStone={showStone} showBuilder={showBuilder} gold={step.resources.gold} dashboardForOverview={true}/>}
//         </div>}
//         {step.type === 'newAge' && <div><div className="buildViewDivider"></div><span className={"buildOrderOverviewListItemTitleHeader"}><div className={"buildOrderOverviewListItemTitleHeaderContent"}><img className="buildViewAgeImage" src={require("./Images/" + step.age + ".png")} alt={"Feudal Age"} width="24px" height="24px"/><strong>{age}</strong></div></span></div>}
//         {(step.type === 'ageUp' && index+1 < this.props.build.length && this.props.build[index+1].type !== 'newAge' && this.props.build[index+1].type !== 'decision') && <div><div className="buildViewDivider"></div><span className={"buildOrderOverviewListItemTitleHeader"}><div className={"buildOrderOverviewListItemTitleHeaderContent"}><strong>Before {age}</strong></div></span></div>}
//     </div>
// )

export default function BuildPage() {
    const styles = useStyles();

    const steps = fakeBuild;

    return (
        <ScrollView style={styles.container}>
            {
                steps.map((step, i) => <Step key={i} {...step} />)
            }
        </ScrollView>
    );
}


const useStyles = createStylesheet((theme, darkMode) => StyleSheet.create({
    workerText: {
        // marginLeft: 10,
        marginRight: 10,
    },
    resourceCount: {
        // marginLeft: 10,
        marginRight: 10,
    },
    buildingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        // marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    villagers: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    buildingPic: {
        marginRight: 10,
        // marginLeft: 10,
        width: 30,
        height: 30,
        borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
        borderWidth: 1,
    },
    picSmall: {
        marginRight: 10,
        width: 22,
        height: 22,
    },
    pic: {
        marginRight: 10,
        width: 30,
        height: 30,
    },
    pic2: {
        marginRight: 10,
        width: 43,
        height: 30,
        // width: 37,
        // height: 26,
    },
    container: {
        // flex: 1,
        padding: 20,
        height: 600,
    },
    heading: {
        marginVertical: 10,
        lineHeight: 20,
        fontWeight: 'bold',
    },
    step: {
        flexDirection: 'column',
        // alignItems: 'center',
        padding: 20,
        marginVertical: 10,
        borderColor: darkMode === 'dark' ? '#444' :  '#CCC',
        borderWidth: 1,
        borderRadius: 10,
    },
}));
