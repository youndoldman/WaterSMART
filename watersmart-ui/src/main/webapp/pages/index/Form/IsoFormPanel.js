Ext.ns("WaterSMART");

WaterSMART.ScenarioOptions = [
                                'PRMSbase',
                                'Dense1',
                                'Dense2',
                                'Dense3',
                                'Sparse1',
                                'Sparse2',
                                'Sparse3',
                                'ACF_CG1',
                                'ACF_CG2',
                                'ACF_CG3',
                                'Special'
                             ];

WaterSMART.ISOFormPanel = Ext.extend(Ext.form.FormPanel, {
    commonAttr : undefined,
    create : undefined,
    htmlTransform : undefined,
    isBestScenario : undefined,
    layer : undefined,
    modelId : undefined,
    modelName : undefined,
    modelerName : undefined,
    modelVersion : undefined,
    runIdentifier : undefined,
    existingVersions : undefined,
    runDate : undefined,
    scenario : undefined,
    wfsUrl : undefined,
    xmlTransform : undefined,
    'abstract' : undefined,

    originalAbstract : undefined,
    originalModelerName : undefined,
    originalModelName : undefined,
    originalModelVersion : undefined,
    originalRunIdentifier : undefined,
    originalRunDate : undefined,
    originalScenario : undefined,

    constructor : function (config) {

        if (!config) config = {};

        this.commonAttr = config.commonAttr;
        this.layer = config.layer || '';
        this.modelId = config.modelId || '';
        this.modelName = this.originalModelName = config.modelName || '';
        this.modelerName = this.originalModelerName = config.modelerName || '';
        this.runIdentifier = this.originalRunIdentifier = config.runIdentifier || 0;
        this.modelVersion = this.originalModelVersion = config.modelVersion || 0;
        this.existingVersions = config.existingVersions || {};
        this.runDate = this.originalRunDate = config.runDate || new Date();
        this.scenario = this.originalScenario = config.scenario;
        this.wfsUrl = config.wfsUrl || '';
        this.create = config.create;
        this.isBestScenario = config.isBestScenario || false;

        this['abstract'] = this.originalAbstract = config['abstract'] || '';

        config = Ext.apply({
            id: 'metadata-form',
            padding: 5,
            region: 'center',
            width: '100%',
            url: 'update',
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: 'Modeler Name',
                    name: 'name',
                    value : this.modelerName,
                    allowBlank: false
                }, {
                    xtype : 'displayfield',
                    fieldLabel: 'Model Name',
                    name: 'model',
                    value : this.modelName,
                    allowBlank: false
                }, {
                    fieldLabel: 'Model Version',
                    name: 'version',
                    ref: 'versionField',
                    value : this.modelVersion,
                    allowBlank: false,
                    validator: this.validateForm
                }, {
                    fieldLabel: 'Run Identifier',
                    name: 'runIdent',
                    ref: 'runIdentField',
                    value : this.runIdentifier,
                    allowBlank: false,
                    validator: this.validateForm
                }, {
                    xtype : 'datefield',
                    fieldLabel: 'Run Date',
                    name: 'creationDate',
                    value : this.runDate,
                    allowBlank: false
                }, {
                    fieldLabel: 'Calibration/ Validation Scenario',
                    xtype: 'combo',
                    mode: 'local',
                    store: WaterSMART.ScenarioOptions,
                    hiddenName: 'scenario',
                    name: 'scenario',
                    ref: 'scenarioField',
                    setEditable: false,
                    forceSelection: true,
                    triggerAction: 'all',
                    emptyText: 'Select a scenario...',
                    selectOnFocus: true,
                    value : this.create ? '' : this.scenario,
                    anchor: '65%',
                    listeners : {
                        select : function (combo, record, index) {
                            LOG.debug("got record: " + record.json);
                            var scenario = record.get(record.fields.first().name);
                            var maxModelVer = 0;
                            var maxRunIdent = 0;
                            Ext.each(this.existingVersions[scenario], function (version) {
                                if (version.split(".")[0] == maxModelVer) {
                                    maxRunIdent = (version.split(".")[1] > maxRunIdent) ? version.split(".")[1] : maxRunIdent;
                                } else if (version.split(".")[0] > maxModelVer) {
                                    maxModelVer = version.split(".")[0];
                                    maxRunIdent = version.split(".")[1];
                                }
                            });
                            if (this.create) {
                                this.runIdentifier = ++maxRunIdent;
                                this.modelVersion = maxModelVer;
                                this.getForm().setValues(
                                    {
                                        'runIdent' : this.runIdentifier,
                                        'version' : this.modelVersion
                                    }
                                );
                            }
                            this.versionField.validate();
                            this.runIdentField.validate();
                        },
                        scope : this
                    }
                }, {
                    fieldLabel: 'Comments',
                    xtype : 'textarea',
                    name: 'comments',
                    value : this['abstract'],
                    allowBlank: true,
                    anchor: '95%'
                }
            ],
            buttons: [
                {
                    text: 'Submit',
                    type: 'submit',
                    formBind: true,
                    handler: function(button) {
                        var uploadPanel = Ext.getCmp('uploadPanel');
                        var metadataForm = Ext.getCmp('metadata-form').getForm().getValues();
                        var isoFormPanel = button.ownerCt.ownerCt;

                        LOG.debug('isoFormPanel.js::Preparing to upload file.');

                        if (isoFormPanel.create) {
                            uploadPanel.getForm().submit({
                                url: uploadPanel.url,
                                scope : this,
                                params: {
                                    name : metadataForm.name,
                                    modelId : isoFormPanel.modelId,
                                    modelVersion : metadataForm.version,
                                    runIdent : metadataForm.runIdent,
                                    creationDate : metadataForm.creationDate,
                                    scenario : metadataForm.scenario,
                                    comments : metadataForm.comments,
                                    email : WATERSMART.USER_EMAIL,
                                    modeltype : isoFormPanel.modelName,
                                    wfsUrl : isoFormPanel.wfsUrl,
                                    layer : isoFormPanel.layer,
                                    commonAttr : isoFormPanel.commonAttr
    //                                markAsBest : isoFormPanel.isBestScenario
                                },
                                waitMsg: 'Saving...',
                                success: function () {
                                    LOG.info('isoFormPanel.js::User upload succeeded.');

                                    Ext.getCmp('model-run-selection-panel').reloadRuns();

                                    LOG.info('isoFormPanel.js::Closing modal window');
                                    this.ownerCt.ownerCt.ownerCt.close();
                                    NOTIFY.info({
                                        msg : 'Your run is being processed. When completed, you will receive an e-mail at ' + WATERSMART.USER_EMAIL + '. You can continue working or close this application.',
                                        hideDelay : 15000
                                    });
                                },
                                failure: function (panel, fail) {
                                    LOG.info('isoFormPanel.js:: User upload failed.');
                                    NOTIFY.error({
                                        msg : fail.result.message
                                    });
                                }
                            });
                        } else {
                            var form = Ext.getCmp('metadata-form');
                            form.getForm().submit({
                                url: form.url,
                                scope : this,
                                params: {
                                    modelId : isoFormPanel.modelId,
                                    originalName : isoFormPanel.originalModelerName,
                                    originalModelVersion : form.originalModelVersion,
                                    originalRunIdent : form.originalRunIdentifier,
                                    originalCreationDate : form.originalRunDate.format('m/d/Y'),
                                    originalScenario : form.originalScenario,
                                    originalComments : form.originalAbstract,
                                    email : WATERSMART.USER_EMAIL,
                                    modeltype : isoFormPanel.modelName,
                                    wfsUrl : isoFormPanel.wfsUrl,
                                    layer : isoFormPanel.layer,
                                    commonAttr : isoFormPanel.commonAttr,
                                    transaction: true
                                },
                                waitMsg: 'Saving...',
                                success: function(form, action) {
                                    LOG.info('isoFormPanel.js::User update succeeded.');
                                    NOTIFY.info({
                                        msg : action.result.msg
                                    });
                                    var task = new Ext.util.DelayedTask(function(){
                                        Ext.getCmp('model-run-selection-panel').reloadRuns();

                                        LOG.info('isoFormPanel.js::Closing modal window');
                                        this.ownerCt.ownerCt.ownerCt.close();
                                    }, this).delay(500);

                                },
                                failure: function(form, action) {
                                    if (action.failureType === 'client') {
                                        NOTIFY.warn({
                                            msg : 'Please ensure all input data is valid'
                                        });
                                    } else {
                                        NOTIFY.warn({
                                            msg : action.result.msg
                                        });
                                    }

                                }
                            });
                        }
                    }
                }
            ]
        }, config);
        WaterSMART.ISOFormPanel.superclass.constructor.call(this, config);

        if (this.create) {
            this.add(new WaterSMART.FileUploadPanel());
        } else if (!this.isBestScenario) {
            this.add(new Ext.form.Checkbox({
                fieldLabel: 'Mark As Best',
                xtype : 'checkbox',
                name : 'markAsBest'
            }));
        }

    },
    validateForm : function () {
        var parentPanel = Ext.ComponentMgr.get('metadata-form');
        var scenario = parentPanel.scenarioField.getValue();
        var newVersion = parentPanel.versionField.getValue() + "." + parentPanel.runIdentField.getValue();
        var origVersion = parentPanel.originalModelVersion + "." + parentPanel.originalRunIdentifier;
        if ((origVersion !== newVersion || parentPanel.originalScenario !== scenario) &&
                scenario !== "" &&
                parentPanel.existingVersions[scenario] &&
                parentPanel.existingVersions[scenario].indexOf(newVersion) >= 0) {
            return "Cannot set version to one already in existance";
        }
        return true;
    }
});

// http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links
WaterSMART.replaceURLWithHTMLLinks = function (text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
};