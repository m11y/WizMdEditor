var objApp = WizExplorerApp;
var objWindow = objApp.Window;

if (objWindow.CurrentDocument != null)
{
    var pluginPath = objApp.GetPluginPathByScriptFileName("md_editor.js");
    var editorFileName = pluginPath + "index.html?doc_guid=" + objWindow.CurrentDocument.GUID + "&kb_guid=" + objWindow.CurrentDocument.Database.KbGUID;
    //
    objWindow.ViewHtml(editorFileName, true);
}
