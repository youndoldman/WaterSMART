<%-- 
    Document   : login
    Created on : Feb 27, 2012, 2:10:11 PM
    Author     : Jordan Walker <jiwalker@usgs.gov>
--%>

<%@page import="gov.usgs.cida.watersmart.ldap.LoginMessage"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <jsp:include page="template/USGSHead.jsp">
            <jsp:param name="shortName" value="NWC Portal" />
            <jsp:param name="title" value="National Water Census Model Intercomparison Portal" />
            <jsp:param name="description" value="National Water Census Model Intercomparison Portal" />
            <jsp:param name="author" value="Jordan Walker"/>
            <jsp:param name="publisher" value="USGS - U.S. Geological Survey, Water Resources; CIDA - Center for Integrated Data Analytics" />
            <jsp:param name="keywords" value="USGS, U.S. Geological Survey, water, earth science, hydrology, hydrologic, data, streamflow, stream, river, lake, flood, drought, quality, basin, watershed, environment, ground water, groundwater" />
            <jsp:param name="revisedDate" value="20120221" />
            <jsp:param name="nextReview" value="20130221" />
            <jsp:param name="expires" value="never" />
        </jsp:include>

        <jsp:include page="js/ext/ext.jsp" />
        <jsp:include page="js/ext/ux/cida-load/cida-load.jsp"/>
    </head>
    <body>
        <jsp:include page="template/USGSHeader.jsp">
            <jsp:param name="header-class" value="x-hidden"/>
            <jsp:param name="site-title" value="National Water Census Model Intercomparison Portal"/>
        </jsp:include>

        <%
            String code = request.getParameter("code");
            String msg = "";
            if (code != null) {
                int codeVal = -1;
                try {
                    codeVal = Integer.parseInt(code);
                } catch (NumberFormatException nfe) {
                    codeVal = -1;
                }
                msg = "<p style=\"color:red\">" + LoginMessage.getMessage(codeVal) + "</p>";
            }
        %>

        <script type="text/javascript">
            Ext.onReady(function() {
                initializeLoadMask();
                LOADMASK.show();
                
                var bodyPanel = new Ext.Panel({
                    id : 'body-panel',
                    layout : 'column',
                    region: 'center',
                    items: [
                        new Ext.Panel({
                            border : false,
                            html : '<img src="images/key.jpg" id="watersmart-key-image" />',
                            style : {
                                'margin-top':'10%'
                            }
                        }),
                        new Ext.FormPanel({
                            id : 'form-panel',
                            style : {
                                'margin-top':'10%'
                            },
                            columnWidth: .3,
                            border: false,
                            autoShow: true,
                            standardSubmit: true,
                            url: 'index.jsp',
                            buttonAlign : 'center',
                            labelSeparator : '',
                            bodyStyle : {
                                'color' : '#616161'
                            },
                            style : {
                                'margin-top' : '9%'
                            },
                            items: [
                                new Ext.Panel({
                                    border : false,
                                    html : '<img src="images/stop-hand.gif" id="watersmart-stophand-image" />&nbsp;Please identify yourself:'
                                }),
                                {
                                    xtype: 'displayfield',
                                    html: '<%= msg%>',
                                    id : 'errorMessage'
                                },{
                                    id : 'username-input-field',
                                    fieldLabel: 'User Name',
                                    xtype: 'textfield',
                                    name: 'username'
                                }, {
                                    id : 'password-input-field',
                                    fieldLabel: 'Password',
                                    xtype: 'textfield',
                                    inputType: 'password',
                                    name: 'password'
                                }],
                            buttons: [{
                                    text: 'Sign In',
                                    handler: function(){
                                        var fp = this.ownerCt.ownerCt,
                                        form = fp.getForm();
                                        if (form.isValid()) {
                                            form.submit();
                                        }
                                    }
                                }]
                        }),
                        new Ext.Panel({
                            id : 'description-panel',
                            columnWidth: .38,
                            html : '<img src="images/watersmart-graphic-small.jpg" id="watersmart-title-image" />'+
                                'The model intercomparison portal provides three primary capabilities.<br /><br />' +
'<ol class="ipsum"><li>Upload hydrologic model results into a database and publish services to serve the uploaded data</li>' +
'<li>Provide centralized processing services to perform comparative statistics</li>' +
'<li>Present model results and comparative statistics in a web user interface</li></ol><br />' +
'Ultimately, this application will allow a modeler to insert their modeling project outcomes ' +
'into a system that can automatically add their results into a portal that will allow the ' +
'modeler (or others) to evaluate the model in comparison to observations or other model outcomes.<br /><br />',
                            style : {
                                'margin-top':'7%',
                                'color' : '#616161'
                            },
                            border : false
                        }),
                        new Ext.Panel({
                            columnWidth: .03,
                            border : false,
                            html : '&nbsp;'
                        })
                    ]
                })
                
                var headerPanel = new Ext.Panel({
                    id: 'header-panel',
                    region: 'north',
                    height: 'auto',
                    border : false,
                    autoShow: true,
                    contentEl: 'usgs-header-panel'
                });
                var footerPanel = new Ext.Panel({
                    id: 'footer-panel',
                    region: 'south',
                    height: 'auto',
                    border : false,
                    autoShow: true,
                    contentEl: 'usgs-footer-panel'
                });
                VIEWPORT = new Ext.Viewport({
                    renderTo : document.body,
                    layout : 'border',
                    items : [
                        headerPanel,
                        bodyPanel,
                        footerPanel
                    ]
                });
                LOADMASK.hide();
            });
            
        </script>

        <% String url = request.getRequestURL().toString(); %>
        <jsp:include page="template/USGSFooter.jsp">
            <jsp:param name="footer-class" value="x-hidden"/>
            <jsp:param name="site-url" value="<%=url%>"/>
            <jsp:param name="contact-info" value="dblodgett@usgs.gov"/>
        </jsp:include>
    </body>
</html>
