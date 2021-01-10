function tableHtmlToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20').replace(/#/g, '%23');
   
    filename = filename?filename+'.xls':'excel_data.xls';
   
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
   
        downloadLink.download = filename;
       
        downloadLink.click();
    }
}

function run_script(code){
	var script = document.createElement('script');
	script.appendChild(document.createTextNode(code));
	(document.head||document.documentElement).appendChild(script);
	script.parentNode.removeChild(script);
}

function logo_rka(){
	jQuery('#action-sipd').append('<label><input type="radio" id="tampil-logo-rka"> Tampilkan LOGO daerah</label>');
	jQuery('#tampil-logo-rka').on('click', function(){
		if(jQuery('#logo-pemda').length == 0){
			set_logo_rka();
		}
	});
}
function set_logo_rka(){
	var logo = chrome.runtime.getURL("img/logo.png");
	var logo_daerah = '<td rowspan="2" align="center" width="100px" style="padding:10px; border: 1px solid #000; font-weight: bold;"><img id="logo-pemda" src="'+logo+'" width="75px"/></td>';
	jQuery('table[cellpadding="5"]').eq(0).find(' tbody tr').eq(0).prepend(logo_daerah);
}

function ttd_kepala_daerah(target){
	var jabatan = "";
	var daerah = window.location.href.split('.')[0].split('//')[1];
	if(window.location.href.split('.')[0].indexOf('kab')){
		jabatan = 'Bupati';
		daerah = daerah.replace('kab', '');
	}else if(window.location.href.split('.')[0].indexOf('prov')){
		jabatan = 'Gubernur';
		daerah = daerah.replace('prov', '');
	}else{
		jabatan = 'Walikota';
	}
	if(config.tgl_rka){
		var tgl = get_tanggal();
		var ttd = '<br>'+capitalizeFirstLetter(daerah)+', '+tgl+'<br>'+jabatan+'<br><br><br><br><br>'+config.kepala_daerah;
		var length = 0;

		target.map(function(n, j){
			jQuery(j).find('tr').eq(0).find('td').map(function(i, b){
				var colspan = jQuery(b).attr('colspan');
				if(!colspan){
					colspan = 1;
				}
				length += +colspan;
			});
			jQuery(j).append('<tr><td colspan="'+length+'"><div style="width: 400px; float: right; font-weight: bold; line-height: 1.5; text-align: center">'+ttd+'</div></td></tr>');
			if(n < target.length-1){
				jQuery(j).closest('table').after('<div style="page-break-after:always;"></div>');
			}
		});
	}
	run_download_excel();
}

function get_tanggal(){
	var _default = "";
	if(config.tgl_dpa == 'auto'){
		var tgl = new Date();
		var bulan = [
			"Januari", 
			"Februari", 
			"Maret", 
			"April", 
			"Mei", 
			"Juni", 
			"Juli", 
			"Agustus", 
			"September", 
			"Oktober", 
			"November", 
			"Desember"
		];
		_default = tgl.getDate()+' '+bulan[tgl.getMonth()]+' '+tgl.getFullYear();
	}else{
		_default = config.tgl_dpa;
	}
	return prompt("Input tanggal tanda tangan", _default);
}

function run_download_excel(){
	var current_url = window.location.href;
	var download_excel = ''
		+'<div id="action-sipd" class="hide-print">'
			+'<a id="excel" onclick="return false;" href="#">DOWNLOAD EXCEL</a>'
		+'</div>';
	// jQuery('td.kiri.kanan.bawah[colspan="13"]').parent().attr('style', 'page-break-inside:avoid; page-break-after:auto');
	jQuery('body').prepend(download_excel);
	jQuery('.cetak > table').attr('id', 'rka');
	// jQuery('html').attr('id', 'rka');

	var style = '';

	style = jQuery('.cetak').attr('style');
	if (typeof style == 'undefined'){ style = ''; };
	jQuery('.cetak').attr('style', style+" font-family:'Open Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; padding:0; margin:0; font-size:13px;");
	
	jQuery('.bawah').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-bottom:1px solid #000;");
	});
	
	jQuery('.kiri').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-left:1px solid #000;");
	});

	jQuery('.kanan').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-right:1px solid #000;");
	});

	jQuery('.atas').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" border-top:1px solid #000;");
	});

	jQuery('.text_tengah').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: center;");
	});

	jQuery('.text_kiri').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: left;");
	});

	jQuery('.text_kanan').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" text-align: right;");
	});

	jQuery('.text_block').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-weight: bold;");
	});

	jQuery('.text_15').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-size: 15px;");
	});

	jQuery('.text_20').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+" font-size: 20px;");
	});

	jQuery('td').map(function(i, b){
		style = jQuery(b).attr('style');
		if (typeof style == 'undefined'){ style = ''; };
		jQuery(b).attr('style', style+' mso-number-format:\\@;');
	});

	jQuery('#excel').on('click', function(){
		var name = "Laporan";
		tableHtmlToExcel('rka', name);
	});
}

function get_kode_giat_laporan(){
	return jQuery('table.tabel-standar[cellpadding="4"]').eq(6).find('td').eq(2).html().split('&nbsp;')[0];
}

function capitalizeFirstLetter(string) {
  	return string.charAt(0).toUpperCase() + string.slice(1);
}

function tambahUser(data_user){
	jQuery('#wrap-loading').show();
	return new Promise(function(resolve, reject){
		jQuery.ajax({
			url: config.sipd_url+'siap/data/user',
			type: 'post',
			data: data_user,
			success: function(res){
				var data_u = { 
					action: 'singkron_user_penatausahaan',
					tahun_anggaran: config.tahun_anggaran,
					api_key: config.api_key,
					data_user: data_user
				};
				var data_back = {
				    message:{
				        type: "get-url",
				        content: {
						    url: config.url_server_lokal,
						    type: 'post',
						    data: data_u,
			    			return: true
						}
				    }
				};
				chrome.runtime.sendMessage(data_back, function(response) {
				    console.log('responeMessage', response);
				});
				return resolve(res);
			}
		});
	});
}

function getUserJabatan(id_user){
	return new Promise(function(resolve, reject){
		if(typeof(user_jabCE) == 'undefined'){
			jQuery.ajax({
				url: config.sipd_url+'data/user-jabatan/'+id_user,
				type: 'get',
				success: function(user_jab){
					window.user_jabCE = user_jab;
					return resolve(user_jabCE);
				}
			});
		}else{
			return resolve(user_jabCE);
		}
	});
}

function getJabatan(){
	return new Promise(function(resolve, reject){
		if(typeof(jabCE) == 'undefined'){
			jQuery.ajax({
				url: config.sipd_url+'siap/data/jabatan-hierarki',
				type: 'get',
				success: function(jab){
					window.jabCE = jab;
					return resolve(jabCE);
				}
			});
		}else{
			return resolve(jabCE);
		}
	});
}

function getUser(id_user){
	return new Promise(function(resolve, reject){
		if(typeof(userCE) == 'undefined'){
			jQuery.ajax({
				url: config.sipd_url+'siap/data/user/'+id_user,
				type: 'get',
				success: function(user){
					window.userCE = user;
					return resolve(userCE);
				}
			});
		}else{
			return resolve(userCE);
		}
	});
}

function getAllUnit(id_unit){
	jQuery('#wrap-loading').show();
	return new Promise(function(resolve, reject){
		if(typeof(allUnitSCE) == 'undefined'){
			if(!id_unit){
				id_unit = 0;
			};
			var data_alamat_kel = { 
				action: 'get_unit',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				id_skpd: id_unit
			};
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_alamat_kel,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
			});
			window.get_unit = resolve;
		}else{
			jQuery('#wrap-loading').hide();
			return resolve(allUnitSCE);
		}
	});
}

function idUser(){
	return jQuery('script[type="text/javascript"]').eq(4).html().split('idUser')[1].split('return ')[1].split(';')[0];
}

function idSkpd(){
	return jQuery('script[type="text/javascript"]').eq(4).html().split('idSkpd')[1].split('return ')[1].split(';')[0];
}