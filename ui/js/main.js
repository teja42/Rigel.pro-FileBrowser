const {ipcRenderer} = require("electron");
let _ = (x)=>document.querySelector(x);

let path = ["/"];
let setPath = (x,y=false)=>{ //true implies go back one directory
   y?path.length==1?true:path.pop():path.push(x);
   _("#path").value = getPath();
   console.log(getPath());
}

let getPath = ()=>{
   let x="";
   for(i=0;i<path.length;i++){
      x+=path[i];
   }
   return x;
}

let updatePath = ()=>_("#path").value = getPath();

let folderTemplate = _("[type=x-folder-template]").innerHTML;
let fileTemplate = _("[type=x-file-template]").innerHTML;
Mustache.parse(folderTemplate);
Mustache.parse(fileTemplate);

ipcRenderer.send("getFiles",getPath());

ipcRenderer.on("getFiles-0",(event,docs)=>{
   let {folders,files} = docs;
   let x;
   _(".main-content").innerHTML = "";
   _(".loading-spinner").style.display = "block";
   setTimeout(()=>{
      _(".loading-spinner").style.display = "none";
   },200);
   // Handle situation if folder is empty.
   if( (!folders) && !files){
      console.log("Empty Folder");
      _(".main-content").insertAdjacentHTML("beforeend",
         "<h3 style='color:black;text-align:center;margin-top:200px;'>This folder is Empty</h3>"
      );
      return;
   }
   for(let i=0;i<folders.length;i++){
      x = Mustache.render(folderTemplate,{name: folders[i]});
      _(".main-content").insertAdjacentHTML("beforeend",x);
   }
   for(let i=0;i<files.length;i++){
      x = Mustache.render(fileTemplate,{name: files[i]});
      _(".main-content").insertAdjacentHTML("beforeend",x);
   }
   updatePath();
});

_(".main-content").ondblclick = (e)=>{
   let x = e.target;
   if(x.classList.value.indexOf("id-folder")>-1){
      let y= x.nextElementSibling.nextElementSibling.innerHTML;
      setPath(`${y}/`);
      ipcRenderer.send("getFiles",getPath());
      console.log(getPath());
   }
}

_("#back").onclick = ()=>{
   setPath(null,true);
   ipcRenderer.send("getFiles",getPath());
}