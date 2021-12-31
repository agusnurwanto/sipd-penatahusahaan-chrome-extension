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
	if(jQuery('table.tabel-standar[cellpadding="4"]').eq(1).find('td').eq(0).text() == 'Organisasi'){
		return jQuery('table.tabel-standar[cellpadding="4"]').eq(1).find('td').eq(2).html().split('&nbsp;')[0];
	}else if(jQuery('table.tabel-standar[cellpadding="4"]').eq(2).find('td').eq(0).text() == 'Organisasi'){
		return jQuery('table.tabel-standar[cellpadding="4"]').eq(2).find('td').eq(2).html().split('&nbsp;')[0];
	}else{
		return jQuery('table.tabel-standar[cellpadding="4"]').eq(8+no_dpa).find('td').eq(2).html().split('&nbsp;')[0];
	}
}

function get_id_skpd_laporan(current_url){
	return new Promise(function(resolve, reject){
		var no_eq = 0;
		var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
		if(cek_no_dpa == 'Nomor DPA'){
			no_eq = 1;
		}
		var kode_skpd = get_kode_skpd_laporan(no_eq);
		var data_skpd = { 
			action: 'get_unit',
			tahun_anggaran: config.tahun_anggaran,
			api_key: config.api_key,
			kode_skpd: kode_skpd
		};
		var data_back = {
		    message:{
		        type: "get-url",
		        content: {
				    url: config.url_server_lokal,
				    type: 'post',
				    data: data_skpd,
	    			return: true
				}
		    }
		};
		chrome.runtime.sendMessage(data_back, function(response) {
		    console.log('responeMessage', response);
		});
		window.get_unit = resolve;
	});
}

function tambahTTDppkd(){
	var type_dpa = jQuery('td.kiri.atas.kanan.bawah.text_tengah').eq(1).text();
	if(config.no_dpa){
		var no_eq = 0;
		var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
		if(cek_no_dpa == 'Nomor DPA'){
			no_eq = 1;
		}
		if(no_eq == 0){
			var html = ''
				+'<tr>'
					+'<td class="kiri atas kanan bawah" style=" border-bottom:1px solid #000; border-left:1px solid #000; border-right:1px solid #000; border-top:1px solid #000; mso-number-format:\@;">'
                        +'<table class="tabel-standar" width="100%" cellpadding="4">'
                            +jQuery('table.tabel-standar').eq(2).html()
                        +'</table>'
                    +'</td>'
				+'</tr>';
			html = jQuery(html);
			html.find('table td').eq(0).text('Nomor DPA');
			html.find('table td').eq(2).text(config.no_dpa);
			
			jQuery('table.tabel-standar').eq(2).closest('tr').before('<tr>'+html.html()+'</tr>');

			/*if(type_dpa.indexOf('PA-RINCIAN BELANJASKPD') != -1){
				jQuery('table.tabel-standar').eq(2).closest('tr').before('<tr>'+html.html()+'</tr>');
			}else{
				jQuery('table[class="tabel-standar"]#rka').map(function(i, table){
					jQuery(table).find('table.tabel-standar').eq(1).closest('tr').before('<tr>'+html.html()+'</tr>');
				});
			}*/
			console.log('insert no DPA');
		}
	}
	jQuery('.text-merah.text_blok.text_20').hide();
	var ttd_ppkd = ''
		+'<tr><td class="text_tengah"><br>Mengesahkan,</td></tr>'
		+'<tr><td class="text_tengah" style="font-size: 110%; text-align: center; mso-number-format:\@;">PPKD</td></tr>'
        +'<tr><td height="80" style=" mso-number-format:\@;">&nbsp;</td></tr>'
        +'<tr><td class="text_tengah" style=" text-align: center; mso-number-format:\@; text-decoration: underline;">'+config.nama_ppkd+'</td></tr>'
        +'<tr><td class="text_tengah" style=" text-align: center; mso-number-format:\@;">NIP. '+config.nip_ppkd+'</td></tr>';
	if(type_dpa.indexOf('PA-RINCIAN BELANJASKPD') != -1){
		var rak = jQuery('table[class="tabel-standar"]');
		if(rak.eq(rak.length-2).find('>tbody .tabel-standar tbody>tr').eq(7).text() != 'PPKD'){
			// rak.eq(rak.length-2).find('>tbody .tabel-standar tbody').append(ttd_ppkd);
			rak.eq(rak.length-2).find('>tbody').append(ttd_ppkd);
		}
	}else{
		jQuery('table[class="tabel-standar"]#rka').map(function(i, table){
			var rak = jQuery(table).find('table[class="tabel-standar"]');
			if(rak.eq(rak.length-2).find('>tbody .tabel-standar tbody>tr').eq(7).text() != 'PPKD'){
				rak.eq(rak.length-2).find('>tbody').append(ttd_ppkd);
			}
		});
	}
}

function capitalizeFirstLetter(string) {
  	return string.charAt(0).toUpperCase() + string.slice(1);
}

function tambahUser(data_user){
	jQuery('#wrap-loading').show();
	return new Promise(function(resolve, reject){
		relayAjax({
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

function singkronCurentUser(){
	jQuery('#wrap-loading').show();
	relayAjax({
		url: config.sipd_url+'siap/user/tampil-profil',
		success: function(current_data){
			getUserJabatan(current_data.id_user, false).then(function(user){
				var data_user = [{
					"skpd":{
						"idSkpd":user.idSkpd,
						"namaSkpd":current_data.nama_skpd,
						"kodeSkpd":null,
						"idDaerah":user.idDaerah
					},
					"userName":user.userName,
					"nip":user.nipPegawai,
					"fullName":user.namaPegawai,
					"nomorHp":user.noHP,
					"rank":user.pangkat,
					"npwp":user.npwp,
					"jabatan":{
						"idJabatan":user.idJabatan,
						"namaJabatan":user.namaJabatan,
						"idRole":user.idRole,
						"order":user.order,
						"label":user.namaJabatan,
						"value":user.idJabatan,
					},
					"kpa":user.idUserKpa,
					"bank":user.bankPembayar,
					"group":user.golongan,
					"kodeBank":user.kodeBank,
					"nama_rekening":user.nama_rekening,
					"nomorRekening":user.nomorRekening,
					"pangkatGolongan":user.pangkatGolongan,
					"tahunPegawai":user.tahunPegawai,
					"kodeDaerah":user.kodeDaerah,
					"is_from_sipd":user.is_from_sipd,
					"is_from_generate":user.is_from_generate,
					"is_from_external":user.is_from_external,
					"idSubUnit":user.idSubUnit,
					"idUser":user.idUser,
					"idPegawai":user.idPegawai,
					"alamat":user.alamat,
					"password":null,
					"konfirmasiPassword":null
				}];
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
			});
		}
	});
}

function singkronUser(){
	jQuery('#wrap-loading').show();
	var data_user = [];
	relayAjax({
		url: config.sipd_url+'siap/data/user',
		success: function(users){
			users.reduce(function(sequence, nextData){
                return sequence.then(function(current_data){
            		return new Promise(function(resolve_reduce, reject_reduce){
            			getUserJabatan(current_data.idUser, false).then(function(user){
        					data_user.push({
        						"skpd":{
									"idSkpd":user.idSkpd,
									"namaSkpd":current_data.namaSkpd,
									"kodeSkpd":null,
									"idDaerah":user.idDaerah
								},
								"userName":user.userName,
								"nip":user.nipPegawai,
								"fullName":user.namaPegawai,
								"nomorHp":user.noHP,
								"rank":user.pangkat,
								"npwp":user.npwp,
								"jabatan":{
									"idJabatan":user.idJabatan,
									"namaJabatan":user.namaJabatan,
									"idRole":user.idRole,
									"order":user.order,
									"label":user.namaJabatan,
									"value":user.idJabatan,
								},
								"kpa":user.idUserKpa,
								"bank":user.bankPembayar,
								"group":user.golongan,
								"kodeBank":user.kodeBank,
								"nama_rekening":user.nama_rekening,
								"nomorRekening":user.nomorRekening,
								"pangkatGolongan":user.pangkatGolongan,
								"tahunPegawai":user.tahunPegawai,
								"kodeDaerah":user.kodeDaerah,
								"is_from_sipd":user.is_from_sipd,
								"is_from_generate":user.is_from_generate,
								"is_from_external":user.is_from_external,
								"idSubUnit":user.idSubUnit,
								"idUser":user.idUser,
								"idPegawai":user.idPegawai,
								"alamat":user.alamat,
								"password":null,
								"konfirmasiPassword":null
        					});
        					return resolve_reduce(nextData);
            			});
        			})
                    .catch(function(e){
                        console.log(e);
                        return Promise.resolve(nextData);
                    });
                })
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve(nextData);
                });
            }, Promise.resolve(users[users.length-1]))
            .then(function(data_last){
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
            })
            .catch(function(e){
                console.log(e);
            });
		}
	});
}

function getUserJabatan(id_user, cache=true){
	return new Promise(function(resolve, reject){
		if(typeof(user_jabCE) == 'undefined'){
			relayAjax({
				url: config.sipd_url+'siap/data/user-jabatan/'+id_user,
				type: 'get',
				success: function(user_jab){
					if(cache){
						window.user_jabCE = user_jab;
						return resolve(user_jabCE);
					}else{
						return resolve(user_jab);
					}
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
			relayAjax({
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
			relayAjax({
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
	var s = jQuery('script');
	var kd = s.eq(s.length-1).html().split('main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/')[1].split("'")[0];
	return kd;
}

function get_kd_sub_bl(){
	var s = jQuery('script');
	var kd = s.eq(s.length-1).html().split('&kode_sub_bl=')[1].split("'")[0];
	return kd;
}

function get_kode_unit(){
	var s = jQuery('script');
	var kd = s.eq(s.length-1).html().split('?kode_unit=')[1].split("&")[0];
	return kd;
}

function singkron_rak_ke_lokal_all_pemda(){
	jQuery('#wrap-loading').show();
	var id_skpd = getIdSkpd();
	relayAjax({
		url: config.sipd_url+'siap/rak-belanja/tampil-unit/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd,
		type: 'get',
		success: function(units){
			var sendData = units.data.map(function(val, n){
                return new Promise(function(resolve, reject){
                	singkron_rak_ke_lokal_all({
                		id_skpd: val.id_skpd
                	}, function(){
                		return resolve();
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

function singkron_rak_ke_lokal_all(opsi, cb){
	if(typeof cb == 'function'){
		var id_skpd = opsi.id_skpd;
	}else{
		jQuery('#wrap-loading').show();
		var id_skpd = getIdSkpd();
	}
	relayAjax({
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
                		kode_sbl: val.id_bidang_urusan+'.'+val.id_program+'.'+val.id_giat+'.'+val.id_sub_giat,
                		kode_unit: val.id_unit+'.'+val.id_skpd+'.'+id_sub_skpd, 
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
        		if(typeof cb == 'function'){
	        		cb();
	        	}else{
	        		alert('Berhasil Singkron Anggaran Kas');
	        		jQuery('#wrap-loading').hide();
	        	}
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
	var kode_unit = '';
	if(opsi && opsi.kode_sbl){
		kode_sbl = opsi.kode_sbl;
		kode_unit = opsi.kode_unit;
	}else{
		if(opsi.type == 'belanja'){
			kode_sbl = get_kd_sub_bl();
			kode_unit = get_kode_unit();
		}
		jQuery('#wrap-loading').show();
	}
	if(!kode_sbl && opsi.type=='belanja'){
		return alert('kodesbl tidak ditemukan!')
	}else{
		var id_skpd = getIdSkpd();
		var url_rak = '';
		if(opsi.type == 'belanja'){
			url_rak = config.sipd_url+'siap/rak-belanja/tampil-rincian/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd+'?kode_unit='+kode_unit+'&kode_sub_bl='+kode_sbl;
		}else if(opsi.type == 'pendapatan'){
			url_rak = config.sipd_url+'siap/rak-pendapatan/tampil-pendapatan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}else if(opsi.type == 'pembiayaan-penerimaan'){
			url_rak = config.sipd_url+'siap/rak-pembiayaan/tampil-pembiayaan/penerimaan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}else if(opsi.type == 'pembiayaan-pengeluaran'){
			url_rak = config.sipd_url+'siap/rak-pembiayaan/tampil-pembiayaan/pengeluaran/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd;
		}
		relayAjax({
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
	if(typeof up_all == 'undefined'){
		alert('Data diload dulu dari lokal. Setelah selesai klik tombol "Save UP Lokal" lagi!');
		load_up_lokal();
	}else{
		jQuery('#wrap-loading').show();
		relayAjax({
			url: config.sipd_url+'siap/data/besaran-up-skpd',
			type: 'get',
			success: function(up){
				var sendData = up.data.map(function(b, i){
                	return new Promise(function(resolve, reject){
                		var cek_up_lokal = true;
						up_all.map(function(val, key){
							if(val.mapping && (val.mapping.id_skpd == b.idSkpd)){
								cek_up_lokal = false;
								var nilai_up = 0;
								val.rinc.map(function(d, n){
									nilai_up += +d.nilai;
								});
								var idBesaranUp = '';
								if(!b.id_besaran_up){
									relayAjax({
										url: config.sipd_url+'siap/edit/skkdh',
										type: 'post',
										data: {
											nilaiMaksimal: nilai_up,
											nilaiBesaranUp: nilai_up,
											idBesaranUp: idBesaranUp,
											idSkpd: b.idSkpd,
											idDaerah: config.id_daerah
										},
										success: function(res){
											return resolve();
										}
									});
								}else{
									idBesaranUp = b.id_besaran_up;
									return resolve();
								}
							}
						});
						if(cek_up_lokal){
							return resolve();
						}
					});
				});
				Promise.all(sendData)
	        	.then(function(val_all){
	        		alert('Berhasil Simpan Data UP Lokal');
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
}

function hapus_rak_all(){
	jQuery('#wrap-loading').show();
	var id_skpd = getIdSkpd();
	relayAjax({
		url: config.sipd_url+'siap/rak-belanja/tampil-giat/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd,
		type: 'get',
		success: function(data){
			var giat = [];
			var nama_giat = [];
			data.data.map(function(b, i){
				if(b.rincian==0 && b.nilai_rak!=0){
					b.kode_sbl = b.id_skpd+'.'+b.id_sub_skpd+'.'+b.id_bidang_urusan+'.'+b.id_program+'.'+b.id_giat+'.'+b.id_sub_giat
					giat.push(b);
					nama_giat.push(b.nama_sub_giat);
				}
			});
			if(nama_giat.length>=1 && confirm('Apa anda yakin untuk menghapus data RAK dari sub kegiatan ini '+nama_giat.join(', ')+'?')){
				var last = giat.length-1;
				giat.reduce(function(sequence, nextData){
                    return sequence.then(function(current_data){
                		return new Promise(function(resolve_reduce, reject_reduce){
                			hapus_rak({ 
								id_skpd: id_skpd,
								kode_sbl: current_data.kode_sbl,
								callback: function(){
									resolve_reduce(nextData);
								}
							});
                		})
                        .catch(function(e){
                            console.log(e);
                            return Promise.resolve(nextData);
                        });
                    })
                    .catch(function(e){
                        console.log(e);
                        return Promise.resolve(nextData);
                    });
                }, Promise.resolve(giat[last]))
                .then(function(data_last){
	        		alert('Berhasil hapus RAK. Refresh/segarkan halaman ini untuk melihat hasilnya!');
					jQuery('#wrap-loading').hide();
                });
			}else{
				jQuery('#wrap-loading').hide();
			}
		}
	});
}

function hapus_rak(options){
	if(options && options.kode_sbl){
		var id_skpd = options.id_skpd;
		var kode_sbl = options.kode_sbl;
		var _alert = false;
	}else{
		var _alert = true;
		jQuery('#wrap-loading').show();
		var id_skpd = getIdSkpd();
		var kode_sbl = get_kode_sbl();
	}
	relayAjax({
		url: config.sipd_url+'siap/rak-belanja/tampil-rincian/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/'+id_skpd+'?kodesbl='+kode_sbl,
		type: 'get',
		success: function(data){
			var _akun = [];
			var no_rek = [];
			data.data.map(function(b, i){
				if(+b.selisih < 0){
					_akun.push(b);
					no_rek.push(b.nama_akun);
				}
			});
			if(
				no_rek.length>=1 
				&& (
					!_alert 
					|| (_alert && confirm('Apa anda yakin untuk menghapus data RAK dari rekening ini '+no_rek.join(', ')+'?'))
				)
			){
				var sendData = _akun.map(function(b, i){
					return new Promise(function(resolve, reject){
	                	simpan_rak(b).then(function(ret){
	                		resolve(ret);
	                	});
				    })
	                .catch(function(e){
	                    console.log(e);
	                    return Promise.resolve({});
	                });
	            });
	            Promise.all(sendData)
	        	.then(function(ret){
	        		if(_alert){
		        		alert('Berhasil hapus RAK. Refresh/segarkan halaman ini untuk melihat hasilnya!');
						jQuery('#wrap-loading').hide();
					}else{
						if(options.callback){
							options.callback();
						}
					}
	        	});
			}else{
				if(_alert){
					jQuery('#wrap-loading').hide();
				}else{
					if(options.callback){
						options.callback();
					}
				}
			}
		}
	});
}

function simpan_rak(options){
	return new Promise(function(resolve, reject){
		var datapost = {
			"idUnit": options.id_unit,
			"idSkpd": options.id_skpd,
			"idSubSkpd": options.id_sub_skpd,
			"idBidang": options.id_bidang_urusan,
			"idProgram": options.id_program,
			"idKegiatan": options.id_giat,
			"idSubKegiatan": options.id_sub_giat,
			"idAkun": options.id_akun,
			"bulanJanuari":0,
			"bulanFebuari":0,
			"bulanMaret":0,
			"bulanApril":0,
			"bulanMei":0,
			"bulanJuni":0,
			"bulanJuli":0,
			"bulanAgustus":0,
			"bulanSeptember":0,
			"bulanOktober":0,
			"bulanNovember":0,
			"bulanDesember":0
		};
		relayAjax({
			url: config.sipd_url+'siap/rak-belanja/simpan-rak-belanja',
			type: 'post',
			data: datapost,
			success: function(data){
				resolve(true);
			}
		});
	});
}

function setLampiran(options){
	jQuery('a.set-lampiran').remove();
	if(typeof link_laporan == 'undefined'){
		link_laporan = {};
	}
	if(typeof link_laporan[options.kode_bl] == 'undefined'){
		link_laporan[options.kode_bl] = {};
	}
	if(link_laporan[options.kode_bl].link){
		set_link_laporan(link_laporan[options.kode_bl]);
	}else{
		jQuery('#wrap-loading').show();
		var data = {
		    message:{
		        type: "get-url",
		        content: {
	                url: config.url_server_lokal,
	                type: 'post',
	                data: { 
	                    action: 'get_link_laporan',
	                    tahun_anggaran: config.tahun_anggaran,
	                    api_key: config.api_key,
	                    kode_bl: options.kode_bl
	                },
	            	return: true
	            }
		    }
		};
		chrome.runtime.sendMessage(data, function(response) {
		    console.log('responeMessage', response);
		});
	}
}

function set_link_laporan(res){
    var link = ''
        +'<a target="_blank" href="'+res.link+'?key='+get_key()+'&type=dpa_perubahan" class="set-lampiran apbd-penjabaran-lampiran btn btn-success pull-right" style="margin-right: 10px;">(LOCAL) '+res.text_link+'</a>';
    jQuery('#mod-hist-jadwal .modal-header .close').after(link);
}

function get_key(){
	var now = new Date().getTime();
	var key = btoa(now+config.api_key+now);
	return key;
}

function singkron_pendahuluan(){
	jQuery('#wrap-loading').show();
	relayAjax({
		url: config.sipd_url+'siap/ttd-dpa/tampil-list-ttd?mode=tim_tapd',
		success: function(res_tapd){
			relayAjax({
				url: config.sipd_url+'siap/ttd-dpa/tampil-list-ttd?mode=data_sekda',
				success: function(res_sekda){
					var data_pendahuluan = {
						tim_tapd: res_tapd,
						data_sekda: res_sekda
					};
					var data = {
					    message:{
					        type: "get-url",
					        content: {
				                url: config.url_server_lokal,
				                type: 'post',
				                data: { 
				                    action: 'singkron_pendahuluan',
				                    tahun_anggaran: config.tahun_anggaran,
				                    api_key: config.api_key,
				                    data: data_pendahuluan
				                },
				            	return: true
				            }
					    }
					};
					chrome.runtime.sendMessage(data, function(response) {
					    console.log('responeMessage', response);
					});
				}
			});
		}
	});
}

function relayAjax(options, retries=20, delay=30000, timeout=90000){
	options.timeout = timeout;
    jQuery.ajax(options)
    .fail(function(){
        if (retries > 0) {
            console.log('Koneksi error. Coba lagi '+retries);
            setTimeout(function(){ 
                relayAjax(options, --retries, delay, timeout);
            },delay);
        } else {
            alert('Capek. Sudah dicoba berkali-kali error terus. Maaf, berhenti mencoba.');
        }
    });
}