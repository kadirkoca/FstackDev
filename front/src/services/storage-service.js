import CryptoJS from "crypto-js"

//Local storage data will be encrypted / its not any logical as long as those key and iv are accessable from browser -- front end
//Just some en/de/cryption practice ;)c

const pass = process.env.APP_SECRET
const authStorageItemKey = "acontext"
const dataStorageItemKey = "datacontext"

export const authContext = () => {
    return {
        authenticated: false,
        token: null,
        user: null,
    }
}

export const dataContext = () => {
    return {
        stacks:null
    }
}

export const channelContext = () => {
    return {
        currentchannelID:null,
        channels:[],
        loadedChannels:[]
    }
}

export const AuthOfStorage = (key = null) => {
    try {
        const serializedContext = sessionStorage.getItem(authStorageItemKey)
        if (serializedContext === null) {
            return undefined
        }
        const decrypted = CryptoJS.AES.decrypt(serializedContext, pass).toString(CryptoJS.enc.Utf8)
        const JSONdecrypted = JSON.parse(decrypted)
        if (key) {
            return JSONdecrypted[key]
        }
        return JSONdecrypted
    } catch(e) {
        return undefined
    }
}

export const AuthToStorage = (context) => {
    try {
        const serializedContext = JSON.stringify(context)
        const encrypted = CryptoJS.AES.encrypt(serializedContext, pass)
        sessionStorage.setItem(authStorageItemKey, encrypted)
    } catch (e) {
        return e
    }
}

export const AuthDestroy = () => {
    try {
        const serializedContext = sessionStorage.removeItem(authStorageItemKey)
    } catch (e) {
        return e
    }
}



////// DATA

export const DataOfStorage = (key = null) => {
    try {
        const serializedContext = sessionStorage.getItem(dataStorageItemKey)
        if (serializedContext === null) {
            return undefined
        }
        const JSONdecrypted = JSON.parse(serializedContext)
        if (key) {
            return JSONdecrypted[key]
        }
        return JSONdecrypted
    } catch(e) {
        return undefined
    }
}

export const DataToStorage = (context) => {
    try {
        const serializedContext = JSON.stringify(context)
        sessionStorage.setItem(dataStorageItemKey, serializedContext)
    } catch (e) {
        return e
    }
}

export const DataDestroy = () => {
    try {
        sessionStorage.removeItem(dataStorageItemKey)
    } catch (e) {
        return e
    }
}