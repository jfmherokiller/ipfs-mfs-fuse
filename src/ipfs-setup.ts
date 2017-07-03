/**
 * Created by peter on 7/1/17.
 */
import * as ipfsAPI from "ipfs-api"
import {unescape} from "querystring";
//let FsFuze = require("./fs-fuse.js");
let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
const fuse = require('fuse-bindings');
const fasefs = require('fs');


function CheckIfFileExists(path, callback) {
    ipfs.files.stat(path, function (error, result) {
        if (error === null) {
            callback(true)
        } else {
            callback(false)
        }
    })
}
export class ipfs_mfs_fuse_merge {

    static readdir(path, callback) {
        console.log('readdir(%s)', path);
        ipfs.files.ls(path, function (error, result) {
            let entry_array = result.Entries;
            let name_array = [];
            for (let item in entry_array) {
                if (entry_array.hasOwnProperty(item)) {
                    name_array.push(entry_array[item].Name);
                }
            }
            callback(0, name_array);
        })
    }

    static getattr(path, callback) {
        console.log('getattr(%s)', path);
        ipfs.files.stat(path, function (error, result) {
            if (error === null) {
                let filetype;
                if (result.Type === 'directory') {
                    filetype = fasefs.constants.S_IFDIR;
                } else if (result.Type === 'file') {
                    filetype = fasefs.constants.S_IFREG;
                }
                let filedata = {
                    mtime: new Date(),
                    atime: new Date(),
                    ctime: new Date(),
                    size: result.CumulativeSize,
                    blocks: result.ChildBlocks,
                    mode: filetype,
                    uid: 0,
                    gid: 0
                };
                callback(0, filedata)
            } else {
                callback(fuse.ENOENT)
            }
        });
    }

    static open(path, flags, callback) {
        console.log('open(%s, %d)', path, flags);
        //callback(fuse.EISDIR, null)
        //callback(fuse.EPERM);
        callback(0, 42);
    }

    static statfs(path, cb) {
        cb(0, {
            bsize: 1000000,
            frsize: 1000000,
            blocks: 1000000,
            bfree: 1000000,
            bavail: 1000000,
            files: 1000000,
            ffree: 1000000,
            favail: 1000000,
            fsid: 1000000,
            flag: 1000000,
            namemax: 1000000
        })
    }

    static write(path, handle, buf, len, offset, cb) {
        console.log('write(%s)', path);
        cb(fuse.EPERM)
    }

    static read(path, fd, buffer, length, position, cb) {
        let args: any = {};
        ipfs.files.read(path, args, function (error, stream) {
            if (error !== null) {
                cb(fuse.EPERM)
            } else {
                //read data
                stream.on('data', function (data) {
                    buffer += data;
                    cb(data.length);
                    //end of data
                }).on('end',function() {
                    cb(0);
                });
            }
        });
        console.log('read(%s)', path);
    }

    static mkdir(path, mode, cb) {
        ipfs.files.mkdir(path);
        console.log('mkdir(%s, %d)', path, mode);
        cb(0)
    }

    static rmdir(path, cb) {
        ipfs.files.rm(path, {recursive: true});
        cb(0);
    }
}
