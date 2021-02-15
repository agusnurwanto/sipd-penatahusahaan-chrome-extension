function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

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

function get_kode_giat_laporan(no_dpa){
	return jQuery('table.tabel-standar[cellpadding="4"]').eq(6+no_dpa).find('td').eq(2).html().split('&nbsp;')[0];
}

function get_kode_skpd_laporan(no_dpa){
	return jQuery('table.tabel-standar[cellpadding="4"]').eq(8+no_dpa).find('td').eq(2).html().split('&nbsp;')[0];
}

function get_id_skpd_laporan(current_url){
	current_url = current_url.split('?')[0].split('/');
	return current_url[current_url.length-1];
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
	var idUser = false;
	jQuery('script[type="text/javascript"]').map(function(i, b){
		var html = jQuery(b).html();
		if(html.indexOf('function idUser()') != -1){
			idUser = html.split('idUser')[1].split('return ')[1].split(';')[0];
		}
	});
	return idUser;
}

function idSkpd(){
	var idSkpd = false;
	jQuery('script[type="text/javascript"]').map(function(i, b){
		var html = jQuery(b).html();
		if(html.indexOf('function idUser()') != -1){
			idSkpd = html.split('idSkpd')[1].split('return ')[1].split(';')[0];
		}
	});
	return idSkpd;
}

function get_kode_sbl(){
	var s = jQuery('script');
	var kd = s.eq(s.length-1).html().split('?kodesbl=')[1].split("'")[0];
	return kd;
}

function getIdSkpd(){
	return window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
}

function singkron_rak_ke_lokal_all(){
	jQuery('#wrap-loading').show();
	var id_skpd = getIdSkpd();
	jQuery.ajax({
		url: config.sipd_url+'siap/rak-belanja/tampil-giat/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd,
		type: 'get',
		success: function(keg){
			var sendData = keg.data.map(function(val, n){
                return new Promise(function(resolve, reject){
                	var id_sub_skpd = val.id_sub_skpd;
                	if(val.id_sub_skpd == 0){
                		id_sub_skpd = val.id_skpd;
                	}
                	singkron_rak_ke_lokal({
                		kode_sbl: val.id_skpd+'.'+id_sub_skpd+'.'+val.id_bidang_urusan+'.'+val.id_program+'.'+val.id_giat+'.'+val.id_sub_giat,
                		type: 'belanja'
                	}, function(detil){
                		val.detil = detil;
                		return resolve(val);
                	});
                })
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve(val);
                });
        	});

			Promise.all(sendData)
        	.then(function(val_all){
        		alert('Berhasil Singkron Anggaran Kas');
        		jQuery('#wrap-loading').hide();
            })
            .catch(function(err){
                console.log('err', err);
        		alert('Ada kesalahan sistem!');
        		jQuery('#wrap-loading').hide();
            });
		}
	});
}
function singkron_rak_ke_lokal(opsi, callback){
	var kode_sbl = '';
	if(opsi && opsi.kode_sbl){
		kode_sbl = opsi.kode_sbl;
	}else{
		if(opsi.type == 'belanja'){
			kode_sbl = get_kode_sbl();
		}
		jQuery('#wrap-loading').show();
	}
	if(!kode_sbl && opsi.type=='belanja'){
		return alert('kodesbl tidak ditemukan!')
	}else{
		var id_skpd = getIdSkpd();
		var url_rak = '';
		if(opsi.type == 'belanja'){
			url_rak = config.sipd_url+'siap/rak-belanja/tampil-rincian/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd+'?kodesbl='+kode_sbl;
		}else if(opsi.type == 'pendapatan'){
			url_rak = config.sipd_url+'siap/rak-pendapatan/tampil-pendapatan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}else if(opsi.type == 'pembiayaan-penerimaan'){
			url_rak = config.sipd_url+'siap/rak-pembiayaan/tampil-pembiayaan/penerimaan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}else if(opsi.type == 'pembiayaan-pengeluaran'){
			url_rak = config.sipd_url+'siap/rak-pembiayaan/tampil-pembiayaan/pengeluaran/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}
		jQuery.ajax({
			url: url_rak,
			type: 'get',
			success: function(rak){
				var data_rak = { 
					action: 'singkron_anggaran_kas',
					tahun_anggaran: config.tahun_anggaran,
					api_key: config.api_key,
					kode_sbl: kode_sbl,
					type: opsi.type,
					data: {}
				};
				rak.data.map(function(b, i){
					data_rak.data[i] = {}
					data_rak.data[i].bulan_1 = b.bulan_1;
					data_rak.data[i].bulan_2 = b.bulan_2;
					data_rak.data[i].bulan_3 = b.bulan_3;
					data_rak.data[i].bulan_4 = b.bulan_4;
					data_rak.data[i].bulan_5 = b.bulan_5;
					data_rak.data[i].bulan_6 = b.bulan_6;
					data_rak.data[i].bulan_7 = b.bulan_7;
					data_rak.data[i].bulan_8 = b.bulan_8;
					data_rak.data[i].bulan_9 = b.bulan_9;
					data_rak.data[i].bulan_10 = b.bulan_10;
					data_rak.data[i].bulan_11 = b.bulan_11;
					data_rak.data[i].bulan_12 = b.bulan_12;
					data_rak.data[i].id_akun = b.id_akun;
					data_rak.data[i].id_bidang_urusan = b.id_bidang_urusan;
					data_rak.data[i].id_daerah = b.id_daerah;
					data_rak.data[i].id_giat = b.id_giat;
					data_rak.data[i].id_program = b.id_program;
					data_rak.data[i].id_skpd = b.id_skpd;
					data_rak.data[i].id_sub_giat = b.id_sub_giat;
					data_rak.data[i].id_sub_skpd = b.id_sub_skpd;
					data_rak.data[i].id_unit = b.id_unit;
					data_rak.data[i].kode_akun = b.kode_akun;
					data_rak.data[i].nama_akun = b.nama_akun;
					data_rak.data[i].selisih = b.selisih;
					data_rak.data[i].tahun = b.tahun;
					data_rak.data[i].total_akb = b.total_akb;
					data_rak.data[i].total_rincian = b.total_rincian;
				});
				var data_back = {
				    message:{
				        type: "get-url",
				        content: {
						    url: config.url_server_lokal,
						    type: 'post',
						    data: data_rak,
			    			return: true
						}
				    }
				};
				if(opsi && opsi.kode_sbl){
					data_back.message.content.return = false;
				}
				chrome.runtime.sendMessage(data_back, function(response) {
				    console.log('responeMessage', response);
					if(callback){
				    	callback(data_rak);
				    }
				});
			}
		})
	}
}

function load_up_lokal(nama_skpd){
	if(typeof up_all == 'undefined'){
		if(nama_skpd){
			alert('Data diload dulu dari lokal. Setelah selesai klik tombol "Load UP Lokal" lagi!');
		}
		jQuery('#wrap-loading').show();
		var data_up = { 
			action: 'get_up',
			tahun_anggaran: config.tahun_anggaran,
			api_key: config.api_key
		};
		var data_back = {
		    message:{
		        type: "get-url",
		        content: {
				    url: config.url_server_lokal,
				    type: 'post',
				    data: data_up,
	    			return: true
				}
		    }
		};
		chrome.runtime.sendMessage(data_back, function(response) {
		    console.log('responeMessage', response);
		});
	}else{
		set_up();
		// console.log('nama_skpd', nama_skpd);
		if(nama_skpd){
			up_all.map(function(val, key){
				if(val.mapping && (val.mapping.nama_skpd == nama_skpd)){
					var nilai_up = 0;
					val.rinc.map(function(d, n){
						nilai_up += +d.nilai;
					})
					jQuery('.edit-skkdh form .form-group input').val(formatMoney(nilai_up,0,0,'.'));
				}
			})
		}
	}
}

function set_up(){
	jQuery('#tab-skkdh table.table-sp2d > tbody > tr').map(function(i, b){
		var td = jQuery(b).find('td');
		var opd = td.eq(1).text().trim();
		var info = '';
		up_all.map(function(val, key){
			if(val.mapping && (val.mapping.nama_skpd == opd)){
				var nilai_up = 0;
				val.rinc.map(function(d, n){
					nilai_up += +d.nilai;
				})
				info = '<br>(NO SPP="'+up_all[i].no_spp+'" Nilai="'+'Rp '+formatMoney(nilai_up,0,0,'.')+'")';
			}
		});
		td.eq(1).append(info);
	});
}

function save_up(){
	jQuery.ajax({
		url: config.sipd_url+'siap/edit/skkdh',
		type: 'post',
		data: {
			nilaiBesaranUp: 0,
			idBesaranUp: 0,
			idSkpd: 0,
			idDaerah: config.id_daerah
		},
		success: function(res){

		}
	});
}