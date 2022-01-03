$(function() {


    // Table setup
    // ------------------------------

    // Setting datatable defaults
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        colReorder: true,
        dom: '<"datatable-header"fBl><"datatable-scroll"t><"datatable-footer"ip>',
        language: {
            search: '<span>Search Name:</span> _INPUT_',
            searchPlaceholder: 'Type to filter...',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        },
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });

    // Generate content for a column
    var table = $('.datatable-control').DataTable({
        "bServerSide": true,
        "bProcessing": true,
        "aoColumns": [
                    {
                        "sTitle" : "#", "mData": "","sWidth": 30,
                        mRender: function (data, type, row, pos) {
                            var info = table.page.info();
                            return Number(info.page) * Number(info.length) + Number(pos.row) + 1;
                        }
                    }, 
                    { "sTitle" : "Control Name", "mData": "name", "sWidth": 100 },
                    { "sTitle" : "Monitor", "mData": "monitor_name", "sWidth": 100 },
                    { "sTitle" : "Process Owner", "mData": "process_owner_name", "sWidth": 150 },
                    { "sTitle" : "Process Name", "mData": "process_name", "sWidth": 150 },
                    { "sTitle" : "Date", "mData": "review_date", "sWidth": 100 },
                    { "sTitle" : "Requirement Met(Yes/No)", "mData": "reason", "sWidth": 100 },
                    { "sTitle" : "Sign Status", "mData": "sign_status", "sWidth": 100,
                        mRender: function (data, type, row){
                            if (row.sign_status == 0){
                                return "Not Sign";
                            }else{
                                return "Sign";
                            }
                        }
                    },
                    {
                        "sTitle" : "Actions", "mData": "", "sWidth": 200,
                        mRender: function (data, type, row) {
                            if (row.sign_status == 0){
                                return  '<ul class="icons-list">' +
                                    '<li><a href="#" class="btn btn-primary btn-sm" style="color: white;" title="Delete">Delete</a></li>' +
                                    '<li><a href="'+base_url+'view_control/'+row.id+'" class="btn btn-primary btn-sm" style="color: white;" title="View">View</a></li>' +
                                    '<li><a onclick="sign('+row.id+')" class="btn btn-primary btn-sm" style="color: white;" title="Review">Sign</a></li>' +
                                    '</ul>';
                            }else{
                                return  '<ul class="icons-list">' +
                                    '<li><a href="#" class="btn btn-primary btn-sm" style="color: white;" title="Delete">Delete</a></li>' +
                                    '<li><a href="'+base_url+'view_control/'+row.id+'" class="btn btn-primary btn-sm" style="color: white;" title="View">View</a></li>' +
                                    '</ul>';
                            }
                        }
                    }
        ],
        "fnServerParams": function (aoData) {
            aoData.push({"name": "process_id", "value": process_id});
            return aoData;
        },
        "fnServerData": function (sSource, aoData, fnCallback){
            $.ajax({
                "dataType": "json",
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": fnCallback
            });
        },
        "bAutoWidth": true,
        "sAjaxSource": base_url+'history_control_read',
        "sAjaxDataProp": "controls",
        scrollX: true,
        scrollCollapse: true,
        "order": [
            [1, "asc"]
        ],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "ideferLoading": 1,
        "bDeferRender": true,
        buttons: {
            buttons: [
                {
                    extend: 'csv',
                    "oSelectorOpts": { filter: 'applied', order: 'current' },
                    text: 'CSV',
                    className: 'btn btn-default'
                }, {
                    extend: 'colvis',
                    text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
                    className: 'btn bg-blue btn-icon',
                }                
            ]
        },
        initComplete: function () {
            oTable = this;
        }
    });
    $('#new_control').click(function () {
        $('#form_control')[0].reset();
        $('#form_control input[name="id"]').val('0');
        $('#form_control input[name="name"]').val('');
        $('#form_control textarea[name="plan"]').val('');
    });

    $('.datatable-control tbody').on('click', 'a[title="Edit"]', function () {
        var data = table.row($(this).parents('tr')).data();
        $('#form_control')[0].reset();
        $('#form_control input[name="id"]').val(data.id);
        $('#form_control input[name="name"]').val(data.name);
        $('#form_control textarea[name="plan"]').html(data.plan);
        $('#form_control select[name="action"]').val(data.action);
        $('#form_control select[name="sme"]').val(data.sme);
        $('#form_control select[name="responsible_party"]').val(data.responsible_party);
        $('#form_control input[name="review_date"]').val(data.review_date);
        $('#form_control select[name="frequency"]').val(data.frequency);
        $('#form_control select[name="assessment"]').val(data.assessment);

        $('#modal_control').modal('show');
    });

    $('.datatable-control tbody').on('click', 'a[title="Delete"]', function () {
        var tr = $(this).parents('tr');
        var data = table.row(tr).data();
        bootbox.confirm("Are you sure?", function(result) {
            if (result) {
                var params = {
                    'ids' : data.id
                };
                $.post(base_url+'delete_control', params, function(data, status){
                    if (JSON.parse(data)['success'] > 0) {
                        new PNotify({
                            title: 'Success',
                            text: 'Successfully Removed.',
                            icon: 'icon-checkmark3',
                            type: 'success'
                        });
                        oTable.api().ajax.url(oTable.fnSettings().sAjaxSource).load();
                        // oTable.fnDeleteRow(tr);
                    } else {
                        new PNotify({
                            title: 'Error',
                            text: 'Failed.',
                            icon: 'icon-blocked',
                            type: 'error'
                        });
                    }
                });
            }
        });
    });

    // Adjust columns on window resize
    setTimeout(function() {
        $(window).on('resize', function () {
            table.columns.adjust();
        });
    }, 100);

    // External table additions
    // ------------------------------
    $('.bootstrap-select').selectpicker();
    // Launch Uniform styling for checkboxes
    $('.ColVis_Button').addClass('btn btn-primary btn-icon').on('click mouseover', function() {
        $('.ColVis_collection input').uniform();
    });
    // Setup validation
    // ------------------------------

    // Initialize
    var validator = $("#form_control").validate({
        ignore: 'input[type=hidden]', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function(element, errorClass) {
            $(element).removeClass(errorClass);
        },
        validClass: "validation-valid-label",
        success: function(label) {
            label.addClass("validation-valid-label").text("Success.")
        },
        submitHandler: function (form) {
            var params={};
            for (i=0; i<form.length; i++) {
                if (form[i].name != '') {
                    params[form[i].name] = form[i].value;
                }
            }
            $.post(base_url+'add_control', params, function(data, status){
                if (data.indexOf("success")>=0){
                    new PNotify({
                        title: 'Success',
                        text: 'Successfully Updated.',
                        icon: 'icon-checkmark3',
                        type: 'success'
                    });
                    form.reset();
                    oTable.api().ajax.url(oTable.fnSettings().sAjaxSource).load();
                }else{
                    new PNotify({
                        title: 'Error',
                        text: data,
                        icon: 'icon-blocked',
                        type: 'error'
                    });
                }
                $('#modal_control').modal('hide');
            });
        }
    });
    
});
