import CryptoJS from "crypto-js"

//Local storage data will be encrypted / its not any logical as long as those key and iv are accessable from browser -- front end
//Just some en/de/cryption practice ;)c

const pass = process.env.APP_SECRET
const authStorageItemKey = "acontext"
const dataStorageItemKey = "datacontext"
const channelStorageItemKey = "channelscontext"

export const authContext = () => {
    const dataset = ReadStorage(null, 'auth')
    if(dataset){
        return dataset
    }
    return {
        authenticated: false,
        token: null,
        user: null,
    }
}

export const dataContext = () => {
    return {
        stacks: null,
    }
}

export const channelContext = (empty = false) => {
    const dataset = ReadStorage(null, 'channel')
    if(dataset && !empty){
        return dataset
    }
    return {
        currentChannel: {},
        channels: [],
        loadedChannels: [],
    }
}


const getTheItemKey = (itemkey) => {
    let StorageItemKey = null
    switch (itemkey) {
        case "auth":
            StorageItemKey = authStorageItemKey
            break
        case "data":
            StorageItemKey = dataStorageItemKey
            break
        case "channel":
            StorageItemKey = channelStorageItemKey
            break
    }
    return StorageItemKey
}

export const ReadStorage = (key = null, itemKey) => {
    try {
        const StorageItemKey = getTheItemKey(itemKey)
        const serializedContext = sessionStorage.getItem(StorageItemKey)
        if (serializedContext === null) {
            return undefined
        }
        
        const data = itemKey === 'auth' ? CryptoJS.AES.decrypt(serializedContext, pass).toString(CryptoJS.enc.Utf8) : serializedContext
        const JSONdecrypted = JSON.parse(data)
        if (key) {
            return JSONdecrypted[key]
        }
        return JSONdecrypted
    } catch (e) {
        return undefined
    }
}

export const WriteStorage = (context, itemKey) => {
    try {
        const StorageItemKey = getTheItemKey(itemKey)
        const serializedContext = JSON.stringify(context)
        let data = serializedContext
        if(itemKey === 'auth'){
            data = CryptoJS.AES.encrypt(serializedContext, pass)
        }
        sessionStorage.setItem(StorageItemKey, data)
    } catch (e) {
        //console.log(e)
        return e
    }
}

export const DestroyDestroy = (itemKey) => {
    try {
        const StorageItemKey = getTheItemKey(itemKey)
        const serializedContext = sessionStorage.removeItem(StorageItemKey)
    } catch (e) {
        return e
    }
}