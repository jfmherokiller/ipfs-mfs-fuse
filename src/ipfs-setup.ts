/**
 * Created by peter on 7/1/17.
 */
import * as ipfsAPI from "ipfs-api"
//let FsFuze = require("./fs-fuse.js");
let ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
import * as fuse from "fuse-bindings"
import * as getStrem from "get-stream";
import Options = require("get-stream");
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
            type: 0x5346544e,
            bsize: 512
        })
    }

    static write(path, handle, buf, len, offset, cb) {
        console.log('write(%s)', path);
        cb(fuse.EPERM, null)
    }

    static read(path, fd, buffer, length, position, cb) {
        let args: any = {};
        console.log('read(path:%s,filedescriptor:%s,length:%s,position:%s)', path, fd, length, position);
        ipfs.files.read(path, args, function (error, stream: NodeJS.ReadableStream) {
            if (error !== null) {
                console.log(error);
                cb(fuse.EPERM, null)
            } else {
                //read data
                getStrem.buffer(stream).then(function (data) {
                    if (position >= data.length) return cb(0); // done
                    let part = data.slice(position, position + length);
                    part.copy(buffer); // write the result of the read to the result buffer
                    cb(part.length) // return the number of bytes read
                })
            }
        });
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
