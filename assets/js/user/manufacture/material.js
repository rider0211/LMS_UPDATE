var oTable;

$(function(){
	var table = $('.datatable-material').DataTable({
		"bServerSide" : true,
		"bProcessing" : true,
		"aoColumns" : [{
			"sTitle" : "No",
			"mData" : "",
			"sWidth": "8%",
			mRender: function (data, type, row, pos) {
				var info = table.page.info();
				return Number(info.page) * Number(info.length) + Number(pos.row) + 1;
			}
		}, {
			"sTitle" : "Name", "mData": "name"
		}, {
			"sTitle" : "Lot Type", "mData": "lot_type", "sWidth": "13%",
			mRender: function(data, type, row) {
				if (data == 'lot')
					return 'Lot Number';
				else if (data == 'trace')
					return 'Trace Code';
				else
					return '';
			}
		}, {
			"sTitle" : "Lot/Trace Number", "mData": "upc", "sWidth": "17%"
		}, {
			"sTitle" : "Barcode", "mData": "barcode", "sWidth": "20%"
		}, {
			"sTitle" : "Supplier", "mData": "supplier_name", "sWidth": "20%"
		}, {
			"sTitle" : "Actions", "mData": "", "sWidth": "8%",
			mRender: function (data, type, row) {
				return  '<ul class="icons-list">' +
					'<li><a class="text-primary-600" href="#" onclick="javascript:onEdit(' + row.id + ')" title="Edit"><i class="icon-pencil7"></i></a></li>' +
					'<li><a class="text-danger-600" href="#" onclick="javascript:onDelete(' + row.id + ')" title="Delete"><i class="icon-trash"></i></a></li>' +
					'</ul>';
			}
		}],
		"fnServerData": function (sSource, aoData, fnCallback){
			$.ajax({
				"dataType": "json",
				"type": "POST",
				"url": sSource,
				"data": aoData,
				"success": fnCallback
			});
		},
		"bAutoWidth": false,
		"sAjaxSource": 'material/read',
		"sAjaxDataProp": "material",
		scrollX: true,
		scrollCollapse: true,
		"order": [
			[1, "asc"]
		],
		columnDefs: [{
			orderable: false,
			targets: [0, 5]
		}],
		lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"ideferLoading": 1,
		"bDeferRender": true,
		buttons: {
			buttons: [{
				extend: 'csv',
				"oSelectorOpts": { filter: 'applied', order: 'current' },
				text: 'CSV',
				className: 'btn btn-default'
			}, {
				extend: 'colvis',
				text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
				className: 'btn bg-blue btn-icon',
			}]
		},
		initComplete: function () {
			oTable = this;
		}
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

	$("#add_form").validate({
		ignore: 'input[type=hidden]',
		errorClass: 'validation-error-label',
		successClass: 'validation-valid-label',
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		validClass: "validation-valid-label",
		rules: {
			'add[name]': { required: true }
			, 'add[type]': { required: true }
			, 'add[upc]': { required: true, number: true }
			, 'add[quantity]': { required: true }
			, 'add[barcode]': { required: true, number: true }
		},
		success: function(label) {
			label.addClass("validation-valid-label").text("Success.");
		},
		submitHandler: function (form) {
			var params = {};
			for (i = 0; i < form.length; i ++) {
				if (form[i].name != '') {
					params[form[i].name] = form[i].value;
				}
			}

			$.post(base_url + 'manufacture/material/add', params, function(resp){
				if (resp.success) {
					new PNotify({
						title: 'Success',
						text: 'Successfully Saved.',
						icon: 'icon-checkmark3',
						type: 'success'
					});

					form.reset();
					oTable.api().ajax.url(oTable.fnSettings().sAjaxSource).load();
					$("#modal_save").modal('hide');
				} else {
					new PNotify({
						title: 'Error',
						text: 'Failed add.',
						icon: 'icon-blocked',
						type: 'error'
					});
				}
			});
		}
	});
});

function onAdd() {
	$("#modal_save .modal-body").load(base_url + 'manufacture/material/add', {}, function(){
		$("#modal_save .modal-title").text("Add Material");
		$("#modal_save .modal-footer button:first").text("Add");
		$("#modal_save").modal();
	});
}

function onEdit(id) {
	$("#modal_save .modal-body").load(base_url + 'manufacture/material/add', {id: id}, function(){
		$("#modal_save .modal-title").text("Edit Material");
		$("#modal_save .modal-footer button:first").text("Save");
		$("#modal_save").modal();
	});
}

function onDelete(id) {
	bootbox.confirm("Do you really delete this material?", function(result){
		if (result) {
			$.post(base_url + 'manufacture/material/delete/' + id, {}, function(resp, status){
				if (resp.success) {
					new PNotify({
						title: 'Success',
						text: 'Successfully Removed.',
						icon: 'icon-checkmark3',
						type: 'success'
					});
					oTable.api().ajax.url(oTable.fnSettings().sAjaxSource).load();
				} else {
					new PNotify({
						title: 'Error',
						text: 'Failed remove.',
						icon: 'icon-blocked',
						type: 'error'
					});
				}
			});
		}
	});
}