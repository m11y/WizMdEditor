var objApp = window.external;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var wizMdPluginPath = objApp.GetPluginPathByScriptFileName("md_editor.js");

/**
 * 加载国际化资源文件
 */
function wizMdLoadString(name) {
    var languageFileName = wizMdPluginPath + "plugin.ini";
    return objApp.LoadStringFromFile(languageFileName, name);
}

/**
 * 获取get参数
 */
function getQueryString(name) {
    if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
        return '';
    }
    var queryString = location.href.substring(location.href.indexOf("?") + 1);

    var parameters = queryString.split("&");

    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) { continue; }

        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);

        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};

//
var guid = getQueryString("doc_guid");
var kbGUID = getQueryString("kb_guid");
//
var objDatabase = null;
if (kbGUID == "" || kbGUID == null) {
    objDatabase = objApp.Database;
} else {
    objDatabase = objApp.GetGroupDatabase(kbGUID);
}

//
var objDocument = null;
//
try {
    objDocument = objDatabase.DocumentFromGUID(guid);
}
catch (err) {
}

//
var modified = false;
var initContent = '';
//
if (objDocument) {
    //
    document.title = objDocument.Title;
    //
    // var tempPath = objCommon.GetSpecialFolder("TemporaryFolder");
    // var d = new Date();
    // var htmlFileTitle = "markdown_" + d.getTime();
    // var htmlResourcePathFrom = htmlFileTitle + "_files";
    // var htmlResourcePathTo = tempPath + htmlResourcePathFrom;

    // var htmlFileName = tempPath + htmlFileTitle + ".html";
    // //
    // objDocument.SaveToHtml(htmlFileName, 0);
    // //
    // var htmlText = objCommon.LoadTextFromFile(htmlFileName);
    // //
    // var replaceFrom = new RegExp(htmlResourcePathFrom, "gi");
    // htmlText = htmlText.replace(replaceFrom, htmlResourcePathTo);
    
    // initContent = htmlText;
    //editor.getSession().setValue(htmlText);

    try{
       //initContent =  objDocument.getHtml();
        initContent =  objDocument.getText(0);
        //initContent = htmlToText(initContent);
    }catch(e){
        alert("html转换文本出错，请使用内部编辑器！");
    }
    //
    var strSave = wizMdLoadString("Save");
    //
    function onAfterExecCommand() {
        modified = true;
    }

    //
    function onKeyDown(type, evt) {
        modified = true;
        var e = evt;
        if (e.ctrlKey && !e.altKey && !e.shiftKey) {
            if (String.fromCharCode(e.keyCode).toLocaleUpperCase() == 'S') {
                //alert('keydown')
                //saveDocument(editor);
                //
                e.returnValue = false;
            } else if (String.fromCharCode(e.keyCode).toLocaleUpperCase() == 'V') {
                if (actionPaste()) {
                    e.returnValue = false;
                    e.keyCode = 0;
                } else {
                }
            }
        }
    }
    //
    //editor.addListener('afterexeccommand', onAfterExecCommand);
    //editor.addListener('keydown', onKeyDown);
}

function actionPaste() {
    try {
        var imagefilename = objCommon.ClipboardToImage(objApp.Window.HWND, "");
        var html = "<img border=\"0\" src=\"" + imagefilename + "\" />";
        editor.execCommand("inserthtml", html);
        return true;
    }
    catch (err) {
        return false;
    }
}

//
function saveDocument(editor) {
    var content = editor.getSession().getValue();

    //这里是一个坑，ace 返回的数据是换行符不是固定的
    content = content.replace(/\r\n/ig, '<br/>');
    content = content.replace(/\n/ig, '<br/>');
    content = content.replace(/\r/ig, '<br/>');
    content = content.replace(/\s/ig, '&nbsp;');
    objDocument.UpdateDocument3(content, 0x0010);
    modified = false;
}

function onBeforeCloseTab_BaiduEditor() {
    if (modified) {
        var msg = wizMdLoadString("strSaveChanges");
        msg = msg.replace(/\%1/gi, objDocument.Title);
        if (6 == objApp.Window.ShowMessage(msg, "Wiz", 0x04 + 0x20)) {
            saveDocument(editor);
        }
    }
}