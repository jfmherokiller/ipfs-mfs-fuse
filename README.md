# ipfs-mfs-fuse

An attempt at mounting the mfs as a filesystem using fuse.

So far i was able to expose the file structure of the filestem but reading and writing are not yet implemented.

to run the code you need typescript installed then run "npm install" or "yarn install". Then run "tsc"  on the root directory and finally.

cd into the src directory and run "node main.js" this should mount the mfs on the M:\ drive.

if you are on linux create a mnt folder in the src folder and the filesystem should be mounted there.

Sorry if the stuff is a mess i made it in one day.
