import {atom} from "recoil";
import {ArchiveModel} from "dd_server_api_web/apis/model/ArchiveModel";

const archivesDataState = atom<ArchiveModel | undefined>({
    key: 'archives-data-key',
    default: undefined
})


export  {archivesDataState}