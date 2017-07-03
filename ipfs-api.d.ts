/**
 * Created by peter on 7/1/17.
 */
export as namespace IpfsAPI;
export = ipfsAPI;
declare function ipfsAPI(hostOrMultiaddr: string, port?: string, opts?);

declare namespace ipfsAPI {
    function version(callback:(err,version:string) => void);
    function ping();
    function ls();

    export interface bitswap {

    }
    export interface block {

    }
    export interface bootstrap {

    }
    export interface files {
        ls(directory:string,callback:(error,result)=> void)
    }
    export interface dht {

    }
    export interface config {

    }
    export interface log {

    }
    export interface repo {

    }
    export interface swarm {

    }
    export interface refs {

    }
    export interface pin {

    }
}