import DdTaokeSdk from "./index";

let api  = DdTaokeSdk.getInstance()
api.host = 'http://localhost'

api.deleteFileinfo(1).then(value => {
    console.log(value)
})