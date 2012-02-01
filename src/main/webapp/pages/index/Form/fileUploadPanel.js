Ext.ns("WaterSMART");

WaterSMART.FileUploadPanel = Ext.extend(Ext.form.FormPanel, {
    constructor : function(config) {
        if (!config) config = {};

        config = Ext.apply({
            title: 'Upload',
            id: 'uploadPanel',
            fileUpload: true,
            bodyPadding: 5,
            width: '50%',
            region: 'east',
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Filename',
                name: 'filename',
                allowBlank: 'false'
            },{
                xtype: 'fileuploadfield',
                id: 'form-file',
                name: 'file-path',
                emptyText: 'Select a file',
                fieldLabel: 'Upload',
                buttonText: 'Choose file'
            }],
            buttons: [{
                text: 'Upload',
                handler: function() {
                    var fp = Ext.getCmp('uploadPanel');
                    if(fp.getForm().isValid()) {
                        fp.getForm().submit({
                            url: 'upload',
                            waitMsg: 'Please be patient while your file uploads',
                            success: function(fp, o) {
                                Ext.Msg.show({
                                    title: 'Success',
                                    msg: o.result.file + ' uploaded',
                                    minWidth: 200,
                                    modal: true,
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                });
                            },
                            failure: function(fp, o) {
                                Ext.Msg.show({
                                    title: 'Failure',
                                    msg: o.result.message,
                                    minWidth: 200,
                                    modal: true,
                                    icon: Ext.Msg.INFO,
                                    buttons: Ext.Msg.OK
                                });
                            }
                        });
                    }
                }
            }]
        }, config);
    WaterSMART.FileUploadPanel.superclass.constructor.call(this, config);
    }
});