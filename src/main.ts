import {ipfs_mfs_fuse_merge} from "./ipfs-setup";
import * as fuse from "fuse-bindings"

function ActualRuntimeMountCode() {
    const mountPath = process.platform !== 'win32' ? './mnt' : 'M:\\';

    fuse.mount(mountPath, {
        readdir: ipfs_mfs_fuse_merge.readdir,
        getattr: ipfs_mfs_fuse_merge.getattr,
        open: ipfs_mfs_fuse_merge.open,
        read: ipfs_mfs_fuse_merge.read,
        mkdir: ipfs_mfs_fuse_merge.mkdir,
        rmdir: ipfs_mfs_fuse_merge.rmdir,
        write: ipfs_mfs_fuse_merge.write,
        statfs:ipfs_mfs_fuse_merge.statfs
    }, function (error) {
        if (error) console.error(' failed to mount:', error)
    });

    process.on('SIGINT', function () {
        fuse.unmount(mountPath, function (error) {
            if (error) throw error;
            process.exit()
        })
    });
}

ActualRuntimeMountCode();