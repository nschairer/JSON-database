/*
    Noah Schairer 7/17/2019
    Class DB
    Methods:
        write - pushes value with random id to desired path
        update - updates value at selected path
        remove - deletes value(s) at selected path
        save - saves db
*/

const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

module.exports = class DB {
    constructor(fileName='db.json') {
        console.log('INITIALIZING JSON DB...')
        this.separator = '/'
        this.dbDirectory = path.join(__dirname, 'db')
        this.filePath = path.join(this.dbDirectory, fileName)
        this.fileName = fileName
        this.readDBFile(this.filePath)
        console.log('DATABASE DIRECTORY\n' + this.dbDirectory)
        console.log('DATABASE FILE PATH\n' + this.filePath + '\n\n')
    }
    readDBFile () {
        if(!fs.existsSync(this.dbDirectory)) {
            console.log('db directory does not exist, creating...')
            fs.mkdirSync(this.dbDirectory)
        }
        if(!fs.existsSync(this.filePath)){
            console.log('db file does not exist, creating...')
            fs.writeFileSync(this.filePath,JSON.stringify({}, null, 4))
        }
        const data = fs.readFileSync(`./db/${this.fileName}`)
        try {
            this.data = JSON.parse(data)
        } catch (e) {
            console.log(e)
            this.data = {}
        }
    }
    
    write(key,value) {
        let id = crypto.randomBytes(20).toString('hex');
        const keys = this.formatKeys(key)
        keys.push(id)
        return this.update(keys,value)
    }

    update(key, value) {
        let keys;
        if(typeof key === 'object') {
            keys = key
        } else {
            keys = this.formatKeys(key)
        }
        if(keys.length > 1) {
            recursiveWrite(keys,0,this.data,value)
        } else {
            this.data[keys[0]] = value
        }
        return this.save()
    }
    get(key) {
        const keys = this.formatKeys(key)
        const obj = recurPath(keys,keys[keys.length-1],this.data)
        return obj ? obj[keys[keys.length-1]] : obj
    }
    remove(key) {
        const keys = this.formatKeys(key)
        const parent = recurPath(keys,keys[keys.length-1],this.data)
        if(!parent) {
            console.log('Nothing to delete')
            return Promise.resolve({message: 'Path did not exist.'})
        }
        delete parent[keys[keys.length-1]]
        return this.save()
    }
    async save() {
        try {
           await fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 4))
           return {
               message: 'File saved.',
               err: null
           }
        } catch(e) {
            return {
                err: e
            }
        }
    }
    formatKeys(key) {
        return key.trim().replace(/(^\/)|(\/$)/g,'').split(this.separator);
    }
}

function recurPath(keys,key,obj,index=0) {
    if(!obj) {
        return null
    }
   
    if(obj[key]) {
        return obj
    }
    if(!obj[keys[index]]) {
        return null
    }
    return recurPath(keys,key,obj[keys[index]],index+=1)
}

function  recursiveWrite(keys,index, currentObj={},value) {
    if(index === keys.length-1) {
        currentObj[keys[index]] = value
        return currentObj
    }
    let key = keys[index]
    if (!currentObj[key]) {
        //overwrite if there is no existing object
        currentObj[key] = {}
    }
    if(typeof currentObj[key] !== 'object') {
        console.log(key)
        console.log(currentObj)
        //overwrite non objects if there
        currentObj[key] = {}
    }
    const next = currentObj[key]
    index++
    recursiveWrite(keys, index,next,value)
}
