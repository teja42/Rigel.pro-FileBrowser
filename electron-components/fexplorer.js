const fs = require("fs");
const _path = require("path");
const {platform} = require("os");

let root = (platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
let docs=[],files=[],folders=[];

// App Codes
// -1 : error
// 1 : Empty Directory

module.exports = class {
   
   constructor(mainWindow,ipcMain){
      ipcMain.on("getFiles",(evt,path)=>{ //send contents of a directory.
         this.read(path,(y)=>{
            if(y===-1){return console.log("An error occured.");}
            mainWindow.webContents.send("getFiles-0",y);
            });
         });
      }

      fdcall(doc,path,fn,last=false){
         fs.lstat(path+doc,(err,stats)=>{
            if(err){ return fn(-1); console.log(err); }
            stats.isDirectory() ? folders.push(doc) : files.push(doc);
            if(last){
               console.log(files,folders);
               fn({files,folders});
               files=[];
               folders=[];
            }
         });
      }

      fileDetails(path,docs,fn){
         let i;
         for(i=0;i<docs.length-1;i++){
            this.fdcall(docs[i],path,fn,false);
         }
         this.fdcall(docs[docs.length-1],path,fn,true);
      }

      read(path=root,fn){
         fs.readdir(path,(err,docs)=>{
            if(err){ return fn(-1); }
            if(docs.length==0){return fn(1);}
            this.fileDetails(path,docs,fn)
         });
      }     
}