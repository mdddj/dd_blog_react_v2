import { ArchiveModel } from "dd_server_api_web/dist/model/ArchiveModel";
import {atom} from "recoil";

const archivesDataState = atom<ArchiveModel | undefined>({
    key: 'archives-data-key',
    default: undefined
})


export  {archivesDataState}