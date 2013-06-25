

function WizMdEditorOnTabclose(objHtmlDocument, objWizDocument) {
    //
    //
    if (objWizDocument)
        return;
    //
    if (!objHtmlDocument)
        return;
    //
    try {
        objHtmlDocument.parentWindow.execScript("if (onBeforeCloseTab_BaiduEditor) onBeforeCloseTab_BaiduEditor();");
    }
    catch (err) {
    }

}

eventsTabClose.add(WizMdEditorOnTabclose);