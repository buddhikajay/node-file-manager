/**
 * Created by thilina on 9/10/16.
 */


/*
*
* Copied from whiteboard. now all file handling tasks are served from node-file-manager
*
*/

var fs = require('co-fs'),
    path = require('path');

exports.processPath = function* (id, batchCode, moduleCode){
    var pathToProcess;
    var classRoomRootDirectory;
    if(id == '#'){
        classRoomRootDirectory = "batch-"+batchCode+"-Module-"+moduleCode;  // root directory belongs to classroom
        pathToProcess = path.resolve(__dirname, '..', 'TestFileServer', classRoomRootDirectory); //root directory of classroom can be identified using batch number n module-code
    }
    else {
        classRoomRootDirectory = id;
        pathToProcess = path.resolve(__dirname, '..', 'TestFileServer', id);
    }

    return yield processRequest(pathToProcess, classRoomRootDirectory);
};

function* processRequest(pathToProcess, classRoomRootDirectory) {
    var resp = [];
    var files = yield fs.readdir(pathToProcess);
    for (var i = files.length - 1; i >= 0; i--) {
        resp.push(yield processNode(pathToProcess, classRoomRootDirectory, files[i]));
    }
    return resp;
}

function* processNode(pathToProcess, classRoomRootDirectory, text) {
    var s = yield fs.stat(path.join(pathToProcess, text));
    return {
        "id": path.join(classRoomRootDirectory, text),
        "text": text,
        //"icon" : s.isDirectory() ? 'jstree-custom-folder' : 'jstree-custom-file',
        "state": {
            "opened": false,
            "disabled": false,
            "selected": false
        },
        "li_attr": {
            "base": path.join(classRoomRootDirectory, text),
            "isLeaf": !s.isDirectory()
        },
        "children": s.isDirectory()
    };
}