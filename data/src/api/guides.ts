import {fetchJson} from '../lib/fetch-json';

export interface IGuide {
    id: string;
    status: string;
    author: string;
    publisher: string;
    title: string;
    imageURL: string;
}

export interface IRemoteGuides {
    documents: IRemoteGuide[];
}

export interface IRemoteGuide {
    fields: {
        [key: string]: {
            stringValue?: string;
            integerValue?: string;
        }
    }
}

// export async function fetchGuides(): Promise<IGuide[]> {
//
//     let json = await fetchJson('fetchGuides', 'https://firestore.googleapis.com/v1/projects/build-order-guide/databases/(default)/documents/published-builds/?pageSize=1000') as IRemoteGuides;
//
//     return json.documents.map(guide => ({
//         id: guide.fields['id']?.stringValue || guide.fields['id']?.integerValue,
//         status: guide.fields['status']?.stringValue,
//         author: guide.fields['author']?.stringValue,
//         publisher: guide.fields['publisher']?.stringValue,
//         title: guide.fields['title']?.stringValue,
//         imageURL: guide.fields['imageURL']?.stringValue,
//     }));
// }
