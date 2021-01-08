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

// http://swwwitch.com/dl/Font-Awesome-Cheetsheet-4.5.0.pdf
jQuery(document).ready(function(){
	if(config.replace_logo){
		var logo = chrome.runtime.getURL("img/logo.png");
		if(jQuery('.media-body img').length >=1){
			jQuery('.media-body img').attr('src', logo);
		}
		if(jQuery('.navbar-top-links .dropdown-toggle img').length >=1){
			jQuery('.navbar-top-links .dropdown-toggle img').attr('src', logo);
		}
		if(jQuery('.user-pro-body img').length >=1){
			jQuery('.user-pro-body img').attr('src', logo);
		}
	}

	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	    +'</div>';
	jQuery('body').prepend(loading);
	var current_url = window.location.href;

	 // halaman SSH
	if(
		current_url.indexOf('/komponen/'+config.tahun_anggaran+'/') != -1 
		&& document.getElementById('table_komponen')
	){
		console.log('halaman referensi SSH');
		var singkron_ssh = ''
			+'<button class="fcbtn btn btn-warning btn-outline btn-1b" id="singkron_ssh_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron SSH ke DB lokal</span>'
			+'</button>'
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_ssh_dari_lokal" style="display: none;">'
				+'<i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron SSH dari DB lokal</span>'
			+'</button>';
		jQuery('button.arsip-komponen').parent().prepend(singkron_ssh);
		var _show_id_ssh = ''
			+'<button onclick="return false;" class="fcbtn btn btn-warning btn-outline btn-1b" id="show_id_ssh">'
				+'<i class="fa fa-eye m-r-5"></i> <span>Tampilkan ID Standar Harga</span>'
			+'</button>';
		jQuery('#table_komponen').closest('form').prepend(_show_id_ssh);
		if(document.getElementsByClassName('tambah-komponen').length){ 
	 		jQuery('#show_id_ssh').attr('style', 'margin-top: -40px; position: absolute; margin-left: 280px;');
			var acion_all = ''
				+'<button onclick="return false;" class="fcbtn btn btn-danger btn-outline btn-1b" id="set_mulit_rek" style="margin-top: -40px; position: absolute;">'
					+'<span>Set Multi Kode SH dan Rek. Belanja</span>'
				+'</button>';
			jQuery('#table_komponen').closest('form').prepend(acion_all);
			var simpan_multiaddkompakun = ''
				+'<button type="button" class="btn btn-danger" name="simpan_multiaddkompakun" id="simpan_multiaddkompakun">Simpan</button>';
			jQuery('#mod-tambah-kompakun .modal-footer').prepend(simpan_multiaddkompakun);
			run_script("jQuery('#mod-tambah-kompakun').on('hidden.bs.modal', function () {"
			  	+"jQuery('#simpan_addkompakun').show();"
			  	+"jQuery('#simpan_multiaddkompakun').hide();"
			  	+"jQuery('select[name=kompakun]').val('').trigger('change');"
			+"});");
		}
		jQuery('#show_id_ssh').on('click', function(){
			jQuery('#wrap-loading').show();
			show_id_ssh();
		});
		jQuery('#set_mulit_rek').on('click', function(){
			set_mulit_rek();
		});
		jQuery('#simpan_multiaddkompakun').on('click', function(){
			jQuery('#wrap-loading').hide();
			var data_ssh = [];
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(jQuery(b).find('td input.set_lockKomponen:checked').length > 0){
					var id = jQuery(b).find('td').eq(7).find('a').attr('onclick');
					id = id.split("'")[1];
					var kode = jQuery(b).find('td').eq(1).text();
					var nama = jQuery(b).find('td').eq(2).text();
					var spek = jQuery(b).find('td').eq(3).text();
					var satuan = jQuery(b).find('td').eq(4).text();
					var harga = jQuery(b).find('td').eq(5).text();
					data_ssh.push({
						kode: kode,
						id: id,
						nama: nama,
						spek: spek,
						satuan: satuan,
						harga: harga
					});
				}
			});
			var items = [];
			data_ssh.map(function(b, i){
				items.push('"'+b.nama+' ['+b.spek+']"');
			})
			var confirm_dulu = "Apakah anda yakin menambahkan rekening ini ke item "+items.join(" | ");
			if(confirm(confirm_dulu)){
				var sendData = data_ssh.map(function(val, n){
	                return new Promise(function(resolve, reject){
	                	jQuery.ajax({
				          	url: "../../simpan-kompakun/"+config.id_daerah+"/0",
				          	type: "post",
				          	data: "_token="+jQuery('meta[name=_token]').attr('content')+'&'+jQuery('#kompakun').serialize()+'&idkomp='+val.id,
				          	success: function(data){
								return resolve(val);
							},
							error: function(argument) {
								console.log(e);
								return resolve(val);
							}
				        });
	                })
	                .catch(function(e){
	                    console.log(e);
	                    return Promise.resolve(val);
	                });
	        	});

	            Promise.all(sendData)
	        	.then(function(val_all){
	        		alert('Berhasil set multiple Rekening Belanja pada item SSH!');
					run_script("jQuery('#mod-tambah-kompakun').modal('hide');");
					run_script('jQuery("select[name=kompakun]").val("").trigger("change");');
	        		jQuery('#wrap-loading').hide();
	            })
	            .catch(function(err){
	                console.log('err', err);
	        		alert('Ada kesalahan sistem!');
	        		jQuery('#wrap-loading').hide();
	            });
	        }
		});
		jQuery('#singkron_ssh_ke_lokal').on('click', function(){
			singkron_ssh_ke_lokal();
		});
		jQuery('#singkron_ssh_dari_lokal').on('click', function(){
			singkron_ssh_dari_lokal();
		});

		function set_mulit_rek(){
			var data_ssh = [];
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(jQuery(b).find('td input.set_lockKomponen:checked').length > 0){
					data_ssh.push(i);
				}
			});
			if(data_ssh.length == 0){
				alert('Pilih dulu item Standar Harga!');
			}else{
				jQuery('#simpan_addkompakun').hide();
				jQuery('#simpan_multiaddkompakun').show();
				run_script("jQuery('#mod-tambah-kompakun').modal('show');");
				jQuery('input[name="idkomp"]').val('');
				run_script('jQuery("select[name=kompakun]").val("").trigger("change");');
			}
		}

		function show_id_ssh(){
			jQuery('#table_komponen tbody tr').map(function(i, b){
				if(document.getElementsByClassName('tambah-komponen').length){ 
			 		var id = jQuery(b).find('td').eq(7).find('a').attr('onclick');
				 	if(id){
					 	id = id.split("'")[1];
					 	var nama = jQuery(b).find('td').eq(2);
					 	nama.html('( '+id+' ) '+nama.html());
					 }
				}else{
			 		var id = jQuery(b).find('td').eq(6).find('a').attr('onclick');
				 	if(id){
					 	id = id.split("'")[1];
					 	var nama = jQuery(b).find('td').eq(1);
					 	nama.html('( '+id+' ) '+nama.html());
					 }
				}
			});
			jQuery('#wrap-loading').hide();
		}

		function send_to_lokal(val){
			var data_ssh = { 
				action: 'singkron_ssh',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				ssh : {}
			};
			val.map(function(b, i){
				// if(i<5){
					data_ssh.ssh[i] = {};
					data_ssh.ssh[i].kode_kel_standar_harga	= b.kode_kel_standar_harga;
					data_ssh.ssh[i].nama_kel_standar_harga	= b.nama_kel_standar_harga;
					data_ssh.ssh[i].id_standar_harga	= b.id_standar_harga;
					data_ssh.ssh[i].kode_standar_harga	= b.kode_standar_harga;
					data_ssh.ssh[i].nama_standar_harga	= b.nama_standar_harga;
					data_ssh.ssh[i].spek	= b.spek;
					data_ssh.ssh[i].satuan	= b.satuan;
					data_ssh.ssh[i].harga	= b.harga;
					data_ssh.ssh[i].harga_2	= b.harga_2;
					data_ssh.ssh[i].harga_3	= b.harga_3;
					data_ssh.ssh[i].is_locked	= b.is_locked;
					data_ssh.ssh[i].is_deleted	= b.is_deleted;
					data_ssh.ssh[i].created_user	= b.created_user;
					data_ssh.ssh[i].created_at	= b.created_at;
					data_ssh.ssh[i].updated_user	= b.updated_user;
					data_ssh.ssh[i].updated_at	= b.updated_at;
					data_ssh.ssh[i].kelompok	= b.kelompok;
					data_ssh.ssh[i].ket_teks	= b.ket_teks;
					data_ssh.ssh[i].kd_belanja	= {};
					b.rek_belanja.map(function(d, c){
						data_ssh.ssh[i].kd_belanja[c]	= {};
						data_ssh.ssh[i].kd_belanja[c].id_akun	= d.id_akun;
						data_ssh.ssh[i].kd_belanja[c].kode_akun	= d.kode_akun;
						data_ssh.ssh[i].kd_belanja[c].nama_akun	= d.nama_akun;
					});
				// }
			});
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_ssh,
					    return: false
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		}

		function singkron_ssh_ke_lokal(){
			if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
				jQuery('#wrap-loading').show();
				jQuery('#persen-loading').attr('persen', 0);
				jQuery('#persen-loading').html('0%');
				var id_sh = window.location.href.split(config.tahun_anggaran+'/')[1].split('/')[0];
				jQuery.ajax({
					url: config.sipd_url+'daerah/main/budget/komponen/'+config.tahun_anggaran+'/'+id_sh+'/tampil-komponen/'+config.id_daerah+'/0',
					contentType: 'application/json',
					success: function(data){

						var data_all = [];
						var data_sementara = [];
						data.data.map(function(b, i){
							data_sementara.push(b);
							var n = i+1;
							if(n%50 == 0){
								data_all.push(data_sementara);
								data_sementara = [];
							}
						});

						var i = 0;
						var last = data_all.length-1;
						data_all.reduce(function(sequence, nextData){
	                        return sequence.then(function(current_data){
                        		return new Promise(function(resolve_redurce, reject_redurce){
		                        	var sendData = current_data.map(function(val, n){
			                            return new Promise(function(resolve, reject){
			                            	jQuery.ajax({
												url: config.sipd_url+'daerah/main/budget/komponen/'+config.tahun_anggaran+'/'+id_sh+'/tampil-komponen-akun/'+config.id_daerah+'/0/'+val.id_standar_harga,
												contentType: 'application/json',
												success: function(ret){
													val.rek_belanja = ret.data;
													return resolve(val);
												},
												error: function(e) {
													console.log(e);
													return resolve(val);
												}
											});
			                            })
			                            .catch(function(e){
			                                console.log(e);
			                                return Promise.resolve(val);
			                            });
		                        	});

		                            Promise.all(sendData)
	                            	.then(function(val_all){
	                            		// i++;
	                            		// if(i==1){
	                            			send_to_lokal(val_all);
	                            		// }
		                				var c_persen = +jQuery('#persen-loading').attr('persen');
		                				c_persen++;
										jQuery('#persen-loading').attr('persen', c_persen);
										jQuery('#persen-loading').html(((c_persen/data_all.length)*100).toFixed(2)+'%');
	                            		return resolve_redurce(nextData);
				                    })
				                    .catch(function(err){
				                        console.log('err', err);
	                            		return resolve_redurce(nextData);
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
	                    }, Promise.resolve(data_all[last]))
	                    .then(function(data_last){
							// console.log(data_last);
							jQuery('#wrap-loading').hide();
							jQuery('#persen-loading').html('');
							jQuery('#persen-loading').attr('persen', '');
							jQuery('#persen-loading').attr('total', '');
							alert('Data berhasil disimpan di database lokal!');
	                    })
	                    .catch(function(e){
	                        console.log(e);
	                    });
					}
				});
			}
		}
	}else if(current_url.indexOf('main/budget/akun/'+config.tahun_anggaran) != -1){
		console.log('halaman akun belanja');
		var singkron_akun_belanja = ''
			+'<button class="fcbtn btn btn-warning btn-outline btn-1b" id="singkron_akun_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron Akun Belanja ke DB lokal</span>'
			+'</button>';
		jQuery('#table_akun').closest('.white-box').find('.pull-right').prepend(singkron_akun_belanja);


		jQuery('#singkron_akun_ke_lokal').on('click', function(){
			singkron_akun_ke_lokal();
		});

		function singkron_akun_ke_lokal(){
			if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
				jQuery('#wrap-loading').show();
				jQuery.ajax({
					url: config.sipd_url+'daerah/main/budget/akun/'+config.tahun_anggaran+'/tampil-akun/'+config.id_daerah+'/0',
					contentType: 'application/json',
					success: function(data){
						var data_akun = { 
							action: 'singkron_akun_belanja',
							tahun_anggaran: config.tahun_anggaran,
							api_key: config.api_key,
							akun : {}
						};
						data.data.map(function(akun, i){
							// if(i<5){
								data_akun.akun[i] = {};
								data_akun.akun[i].belanja = akun.belanja;
								data_akun.akun[i].id_akun = akun.id_akun;
								data_akun.akun[i].is_bagi_hasil = akun.is_bagi_hasil;
								data_akun.akun[i].is_bankeu_khusus = akun.is_bankeu_khusus;
								data_akun.akun[i].is_bankeu_umum = akun.is_bankeu_umum;
								data_akun.akun[i].is_barjas = akun.is_barjas;
								data_akun.akun[i].is_bl = akun.is_bl;
								data_akun.akun[i].is_bos = akun.is_bos;
								data_akun.akun[i].is_btt = akun.is_btt;
								data_akun.akun[i].is_bunga = akun.is_bunga;
								data_akun.akun[i].is_gaji_asn = akun.is_gaji_asn;
								data_akun.akun[i].is_hibah_brg = akun.is_hibah_brg;
								data_akun.akun[i].is_hibah_uang = akun.is_hibah_uang;
								data_akun.akun[i].is_locked = akun.is_locked;
								data_akun.akun[i].is_modal_tanah = akun.is_modal_tanah;
								data_akun.akun[i].is_pembiayaan = akun.is_pembiayaan;
								data_akun.akun[i].is_pendapatan = akun.is_pendapatan;
								data_akun.akun[i].is_sosial_brg = akun.is_sosial_brg;
								data_akun.akun[i].is_sosial_uang = akun.is_sosial_uang;
								data_akun.akun[i].is_subsidi = akun.is_subsidi;
								data_akun.akun[i].kode_akun = akun.kode_akun;
								data_akun.akun[i].nama_akun = akun.nama_akun;
								data_akun.akun[i].set_input = akun.set_input;
								data_akun.akun[i].set_lokus = akun.set_lokus;
								data_akun.akun[i].status = akun.status;
							// }
						});
						var data = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: data_akun,
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
		}
	}else if(
		current_url.indexOf('rka-bl-rinci/cetak') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/41/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/42/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('dokumen/'+config.tahun_anggaran+'/rka-penda/cetak/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('belanja/'+config.tahun_anggaran+'/rinci/cetak/'+config.id_daerah+'/') != -1
	){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'html');
		if(current_url.indexOf('dokumen/'+config.tahun_anggaran+'/rka-penda/cetak/'+config.id_daerah+'/') == -1){
			if(config.tgl_rka){
				var tgl = get_tanggal();
				var tgl_rka = jQuery(jQuery('td.text_tengah[colspan="3"]')[0]);
				tgl_rka.text(tgl_rka.text().replace(/\./g, '')+' '+tgl);
			}
		}
		if(config.tapd){
			var tr_tapd = jQuery('table[cellpadding="5"][cellspacing="0"] tr.text_tengah').parent().find('tr');
			config.tapd.map(function(b, i){
				var td = jQuery(tr_tapd[i+2]).find('td');
				td.eq(1).text(b.nama);
				td.eq(2).text(b.nip);
				td.eq(3).text(b.jabatan);
			});
		}

		run_download_excel();
		if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/kua/41/'+config.id_daerah+'/setunit') != -1){
			jQuery('table[cellpadding="5"] tr').map(function(i,b){
			    var kode = jQuery(b).find('td').eq(0).text().split('.');
			    if(kode.length == 5){
			        jQuery(b).addClass('kegiatan');
			    }else if(kode.length == 6){
			        jQuery(b).addClass('sub_kegiatan');
			    }
			});
			var opsiprint = ''
				+'<label><input type="radio" id="hide_kegiatan"> Sembunyikan Kegiatan dan Sub kegiatan</label><br>'
			jQuery('#action-sipd').append(opsiprint);
			jQuery('#hide_kegiatan').on('click', function(){
				if(jQuery(this).prop('checked')){
					jQuery('.kegiatan').remove();
					jQuery('.sub_kegiatan').remove();
				}
			});
		}else if(
			current_url.indexOf('belanja/'+config.tahun_anggaran+'/rinci/cetak/'+config.id_daerah+'/') != -1
			|| current_url.indexOf('rka-bl-rinci/cetak') != -1
		){
			logo_rka();
			
			var opsiprint = ''
				+'<label><input type="radio" id="tampil_alamat"> Tampilkan Alamat Rincian</label><br>'
			jQuery('#action-sipd').append(opsiprint);
			jQuery('#tampil_alamat').on('click', function(){
				if(current_url.indexOf('rka-bl-rinci/cetak') != -1){
					jQuery('#wrap-loading').show();
					var subkeg = {};
					var kode_sub = '';
					jQuery('table[cellpadding="5"]').eq(4).find('>tbody>tr').map(function(i, b){
						var td = jQuery(b).find('>td');
						if(td.length == 1){
							kode_sub = td.find('table>tbody>tr').eq(0).find('td').eq(2).html().split('&nbsp;')[0];
							subkeg[kode_sub] = {};
						}else{
							subkeg[kode_sub][i] = 'tr_id';
						}

					});
					var sendData = [];
					for(var i in subkeg){
						sendData.push(new Promise(function(resolve_reduce, reject_reduce){
							tampil_alamat_rka(i, subkeg[i], function(){
								resolve_reduce();
							});
						}))
					}
					Promise.all(sendData)
					.then(function(val){
						jQuery('#wrap-loading').hide();
					});
				}else{
					tampil_alamat_rka();
				}
			});
		}
	}else if(
		current_url.indexOf('belanja/'+config.tahun_anggaran+'/giat/unit/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('belanja/'+config.tahun_anggaran+'/giat/list/'+config.id_daerah+'/') != -1
	){
		console.log('halaman sub kegiatan');
		var singkron_rka = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rka_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RKA ke DB lokal</span>'
			+'</button>';
		// halaman list SKPD oleh admin TAPD
		if(jQuery('.icon-basket').closest('.m-t-0').length == 0){
			jQuery('.m-l-10').closest('.p-b-20').find('.col-md-2').append('<div class="button-box pull-right p-t-20">'+singkron_rka+'</div>');
			jQuery('#singkron_rka_ke_lokal').attr('id_unit', 'all');
		// halaman list sub kegiatan oleh kepala PD
		}else if(jQuery('#form_bl .pull-right.p-t-20').length >= 1){
			jQuery('#form_bl .pull-right.p-t-20').append(singkron_rka);
		// halaman sub kegiatan
		}else{
			jQuery('.icon-basket').closest('.m-t-0').append('<div class="col-xs-12 col-md-6"><div class="button-box pull-right p-t-20">'+singkron_rka+'</div></div>');
		}
		jQuery('#singkron_rka_ke_lokal').on('click', function(){
			var cek_unit = jQuery('#singkron_rka_ke_lokal').attr('id_unit');
			if(cek_unit == 'all'){
				if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
					jQuery.ajax({
						url: config.sipd_url+'daerah/main/budget/belanja/'+config.tahun_anggaran+'/giat/tampil-unit/'+config.id_daerah+'/0',
						type: 'get',
						success: function(units){
							jQuery('#persen-loading').attr('persen', 0);
							jQuery('#persen-loading').html('0%');
							var last = units.data.length-1;
							jQuery('#persen-loading').attr('total', units.data.length);
							units.data.reduce(function(sequence, nextData){
			                    return sequence.then(function(current_data){
			                		return new Promise(function(resolve_reduce, reject_reduce){
		                				var c_persen = +jQuery('#persen-loading').attr('persen');
		                				c_persen++;
										jQuery('#persen-loading').attr('persen', c_persen);
										jQuery('#persen-loading').html(((c_persen/units.data.length)*100).toFixed(2)+'%'+'<br>'+current_data.nama_skpd.nama_skpd);
			                			singkron_rka_ke_lokal_all(current_data, function(){
			                				console.log('next reduce', nextData);
											resolve_reduce(nextData);
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
			                }, Promise.resolve(units.data[last]))
			                .then(function(data_last){
			                	var opsi = { 
									action: 'get_cat_url',
									api_key: config.api_key,
									category : 'Semua Perangkat Daerah Tahun Anggaran '+config.tahun_anggaran
								};
								var data = {
								    message:{
								        type: "get-url",
								        content: {
										    url: config.url_server_lokal,
										    type: 'post',
										    data: opsi,
							    			return: true
										}
								    }
								};
								chrome.runtime.sendMessage(data, function(response) {
								    console.log('responeMessage', response);
								});
			                })
			                .catch(function(e){
			                    console.log(e);
			                });
						}
					});
				}
			}else{
				singkron_rka_ke_lokal_all();
			}
		});
	}else if(current_url.indexOf('skpd/'+config.tahun_anggaran+'/list/'+config.id_daerah+'') != -1){
		var singkron_skpd = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_skpd_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron SKPD ke DB lokal</span>'
			+'</button>';
		jQuery('.button-box.pull-right.p-t-0').parent().prepend(singkron_skpd);
		jQuery('#singkron_skpd_ke_lokal').on('click', function(){
			singkron_skpd_ke_lokal();
		});
	}else if(current_url.indexOf('belanja/'+config.tahun_anggaran+'/rinci/list/'+config.id_daerah+'') != -1){
		// harus di inject agar bekerja
		run_script('window.ext_url = "'+chrome.extension.getURL('')+'"');
		injectScript( chrome.extension.getURL('/js/content/rka.js'), 'html');

		var singkron_rka = ''
			+'<button class="fcbtn btn btn-info btn-outline btn-1b" id="download_data_excel" style="display: none;">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Download Rincian Excel</span>'
			+'</button>'
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rka_ke_lokal">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RKA ke DB lokal</span>'
			+'</button>';
		jQuery('.icon-basket').closest('.m-t-10').find('.pull-right.p-t-20').prepend(singkron_rka);
		jQuery('#download_data_excel').on('click', function(){
			tableHtmlToExcel('data_rin_excel', jQuery('table.m-b-0>tbody>tr').eq(4).find('td').eq(2).text().trim());
		});
		jQuery('#singkron_rka_ke_lokal').on('click', function(){
			jQuery('#download_data_excel').hide();
			jQuery('body').prepend(''
				+'<table id="data_rin_excel" style="display:none; margin-top: 60px; background: #fff;" class="table table-bordered">'
					+'<thead>'
						+'<tr>'
							+'<th>No</th>'
							+'<th>kode_sbl</th>'
							+'<th>jenis_bl</th>'
							+'<th>idsubtitle</th>'
							+'<th>subs_bl_teks</th>'
							+'<th>idketerangan</th>'
							+'<th>ket_bl_teks</th>'
							+'<th>kode_akun</th>'
							+'<th>nama_akun</th>'
							+'<th>nama_komponen</th>'
							+'<th>spek_komponen</th>'
							+'<th>koefisien</th>'
							+'<th>satuan</th>'
							+'<th>harga_satuan</th>'
							+'<th>totalpajak</th>'
							+'<th>rincian</th>'
							+'<th>id_rinci_sub_bl</th>'
							+'<th>id_penerima</th>'
							+'<th>lokus_akun_teks</th>'
							+'<th>id_prop_penerima</th>'
							+'<th>id_camat_penerima</th>'
							+'<th>id_kokab_penerima</th>'
							+'<th>id_lurah_penerima</th>'
							+'<th>idkomponen</th>'
						+'</tr>'
					+'</thead>'
				+'</table>');
			singkron_rka_ke_lokal();
		});
	// SIKRONISASI PROGRAM PRIORITAS NASIONAL DENGAN PROGRAM PRIORITAS DAERAH (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/9/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// SINKRONISASI PROGRAM, KEGIATAN DAN SUB KEGIATAN PADA RKPD DAN PPAS (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/8/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// SINKRONISASI PROGRAM PADA RPJMD DENGAN APBD (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/7/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// REKAPITULASI BELANJA UNTUK PEMENUHAN SPM (APBD perda)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/6/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// URUSAN PEMERINTAHAN DAERAH DAN FUNGSI DALAM KERANGKA PENGELOLAAN KEUANGAN NEGARA (APBD perda) 5
	// ALOKASI BANTUAN KEUANGAN BERSIFAT UMUM dan KHUSUS YANG DITERIMA SERTA SKPD PEMBERI BANTUAN KEUANGAN (APBD penjabaran) 5
	// REKAPITULASI BELANJA MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PROGRAM DAN KEGIATAN BESERTA HASIL DAN SUB KEGIATAN BESERTA KELUARAN (APBD perda) 4
	// ALOKASI BANTUAN SOSIAL BERUPA UANG YANG DITERIMA SERTA SKPD PEMBERI BANTUAN SOSIAL & ALOKASI HIBAH BERUPA BARANG/JASA YANG DITERIMA SERTA SKPD PEMBERI HIBAH (APBD penjabaran) 4
	// RINCIAN APBD MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PENDAPATAN, BELANJA DAN PEMBIAYAAN (APBD perda) 3
	// DAFTAR ALOKASI HIBAH BERUPA UANG YANG DITERIMA SERTA SKPD PEMBERI HIBAH (APBD penjabaran) 3
	}else if(
		current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/4/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/3/'+config.id_daerah+'/setunit') != -1
		|| current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/5/'+config.id_daerah+'/setunit') != -1
	){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		jQuery('#wrap-loading').show();
		jQuery('table[cellpadding="3"]').map(function(i, b){
			jQuery(b).before('<table id="header-title'+i+'" width="100%"><tbody></tbody></table>');
			jQuery(b).find('tr>td>div').closest('tr').prependTo("#header-title"+i+">tbody");
		});
		jQuery('table[align="right"]').map(function(i, b){
			jQuery(b).insertBefore("#header-title"+i);
		});
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));

		var table = [];
		jQuery('table[cellpadding="3"]').map(function(i, b){
			table.push(b);
		});
		var nomor_lampiran = getNomorLampiran();
		var last = table.length-1;
		table.reduce(function(sequence, nextData){
            return sequence.then(function(current_data){
        		return new Promise(function(resolve_reduce, reject_reduce){
        			var dinas = {
						kode: '',
						nama: '',
						data: {}
					};
					var subkeg = {
						kode: '',
						nama: '',
						data: {}
					}
        			var tr = [];
        			jQuery(current_data).find('>tbody>tr').map(function(n, m){
        				tr.push(m);
        			});
        			var lasttr = tr.length-1;
        			tr.reduce(function(sequence2, nextData2){
			            return sequence2.then(function(current_data2){
			        		return new Promise(function(resolve_reduce2, reject_reduce2){
        						var td = jQuery(current_data2).find('td');
        						console.log('tr', current_data2);
								if(td.length == 2){
									var text = td.eq(1).text().split(' ');
									var kode = text.shift();
									var nama = text.join(' ');
									if(kode.split('.').length == 8){
										dinas.kode = kode;
										dinas.nama = nama;
										getAllUnit().then(function(unit){
											unit.map(function(un, m){
												if(un.kode_skpd == dinas.kode){
													dinas.data = un;
												}
											});
			        						resolve_reduce2(nextData2);
										})
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									}else{
										subkeg.kode = kode;
										subkeg.nama = nama;
										subkeg.sub_skpd = [];
										getAllUnit().then(function(unit){
											unit.map(function(un, m){
												if(un.id_unit == dinas.data.id_unit){
													subkeg.sub_skpd.push(un);
												}
											});
											console.log('subkeg.sub_skpd', subkeg.sub_skpd);
											var lastsubskpd = subkeg.sub_skpd.length-1;
											subkeg.sub_skpd.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
									        			console.log('current_data3.id_skpd', current_data3, current_data3.id_skpd);
														getAllSubKeg(current_data3.id_skpd).then(function(all_sub){
															all_sub.map(function(sub, m){
																if(sub.kode_sub_giat == subkeg.kode){
																	subkeg.data = sub;
																	dinas.data = current_data3;
																}
															});
							        						resolve_reduce3(nextData3);
														})
											            .catch(function(e){
											                console.log(e);
											                resolve_reduce3(nextData3);
											            });
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(subkeg.sub_skpd[lastsubskpd]))
									        .then(function(){
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
										})
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									}
								}else if(td.length == 4){
									var kelompok = {
										nama: td.eq(1).text().trim(),
										data: []
									};
									getRincSubKeg(dinas.data.id_skpd, subkeg.data.kode_sbl).then(function(all_rinc){
										var penerima = [];
										var nomor = 0;
										var _style = {
											td_1: 'class="'+td.eq(0).attr('class')+'" width="'+td.eq(0).attr('width')+'" style="'+td.eq(0).attr('style')+'"',
											td_2: 'class="'+td.eq(1).attr('class')+'" width="'+td.eq(1).attr('width')+'" style="'+td.eq(1).attr('style')+'"',
											td_3: 'class="'+td.eq(2).attr('class')+'" width="'+td.eq(2).attr('width')+'" style="'+td.eq(2).attr('style')+'"',
											td_4: 'class="'+td.eq(3).attr('class')+'" width="'+td.eq(3).attr('width')+'" style="'+td.eq(3).attr('style')+'"'
										}

										var jenis_bl = '';
										var jenis_akun = '';
										if(nomor_lampiran == 3){
											jenis_bl = 'HIBAH,BOS';
											jenis_akun = 'is_hibah_uang';
										}else if(nomor_lampiran == 4){
											jenis_bl = 'BANSOS';
											jenis_akun = 'is_sosial_uang';
										}else if(nomor_lampiran == 5){
											jenis_bl = 'BANKEU';
											jenis_akun = 'is_bankeu_khusus,is_bankeu_umum';
										}
										getMultiAkunByJenisBl(jenis_bl, dinas.data.id_skpd, subkeg.data.kode_sbl, jenis_akun).then(function(akun){
											if(!kelompok.nama){
												var total_bansos = 0;
												all_rinc.map(function(rin, m){
													if(
														(
															(rin.jenis_bl == 'bansos' && nomor_lampiran == 4)
															|| (rin.jenis_bl == 'hibah' && nomor_lampiran == 3)
														)
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
														total_bansos += +rin.rincian;
													}
												});
												console.log('total bansos/hibah uang', dinas.nama, subkeg.nama, total_bansos);
											}else{
												all_rinc.map(function(rin, m){
													if(
														rin.subs_bl_teks == kelompok.nama
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
													}
												});
											}
											var penerimaHTML = [];
											var lastpenerima = penerima.length-1;
											penerima.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
														getDetailPenerima(subkeg.data.kode_sbl, false, nomor_lampiran).then(function(all_penerima){
															getDetailRin(dinas.data.id_skpd, subkeg.data.kode_sbl, current_data3.id_rinci_sub_bl, nomor_lampiran)
															.then(function(rinci_penerima){
																var alamat = '';
																if(nomor_lampiran == 5){
																	alamat = 'Provinsi '+rinci_penerima.nama_prop
																		+', '+rinci_penerima.nama_kab
																		+', Kecamatan '+rinci_penerima.nama_kec
																		+', '+rinci_penerima.nama_kel;
																}else{
																	all_penerima.map(function(p, o){
																		if(p.id_profil == rinci_penerima.id_penerima){
																			alamat = p.alamat_teks+' - '+p.jenis_penerima;
																		}
																	});
																}
																penerimaHTML[current_data3.nomor] = ''
																	+'<tr class="tambahan">'
																		+'<td '+_style.td_1+'>'+current_data3.nomor+'</td>'
																		+'<td '+_style.td_2+'>'+current_data3.lokus_akun_teks+'</td>'
																		+'<td '+_style.td_3+'>'+alamat+' ('+current_data3.koefisien+' x '+formatRupiah(current_data3.harga_satuan)+')</td>'
																		+'<td '+_style.td_4+'>'+formatRupiah(current_data3.rincian)+'</td>'
																	+'</tr>';
										                    	return resolve_reduce3(nextData3);
															});
														});
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(penerima[lastpenerima]))
									        .then(function(){
												console.log('dinas, subkeg, kelompok', dinas, subkeg, kelompok);
												jQuery(current_data2).after(penerimaHTML.join(''));
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
									    })
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									});
								}else if(td.length == 5){
									var kelompok = {
										nama: td.eq(1).text().trim(),
										bentuk: td.eq(3).text().trim(),
										total: td.eq(4).text().trim().replace(/\./g, ''),
										data: []
									};
									if(isNaN(kelompok.total) || +kelompok.total == 0){
							            resolve_reduce2(nextData2);
									};
									if(kelompok.bentuk.indexOf('[?]') != -1){
										kelompok.bentuk = '[?]';
									};
									getRincSubKeg(dinas.data.id_unit, subkeg.data.kode_sbl).then(function(all_rinc){
										var penerima = [];
										var nomor = 0;
										var _style = {
											td_1: 'class="'+td.eq(0).attr('class')+'" width="'+td.eq(0).attr('width')+'" style="'+td.eq(0).attr('style')+'"',
											td_2: 'class="'+td.eq(1).attr('class')+'" width="'+td.eq(1).attr('width')+'" style="'+td.eq(1).attr('style')+'"',
											td_3: 'class="'+td.eq(2).attr('class')+'" width="'+td.eq(2).attr('width')+'" style="'+td.eq(2).attr('style')+'"',
											td_4: 'class="'+td.eq(3).attr('class')+'" width="'+td.eq(3).attr('width')+'" style="'+td.eq(3).attr('style')+'"',
											td_5: 'class="'+td.eq(4).attr('class')+'" width="'+td.eq(4).attr('width')+'" style="'+td.eq(4).attr('style')+'"'
										}

										var jenis_bl = '';
										var jenis_akun = '';
										if(nomor_lampiran == 3){
											jenis_bl = 'HIBAH-BRG';
											jenis_akun = 'is_hibah_brg';
										}else if(nomor_lampiran == 4){
											jenis_bl = 'BANSOS-BRG';
											jenis_akun = 'is_sosial_brg';
										}
										getMultiAkunByJenisBl(jenis_bl, dinas.data.id_unit, subkeg.data.kode_sbl, jenis_akun).then(function(akun){
											if(!kelompok.nama){
												var total_bansos = 0;
												all_rinc.map(function(rin, m){
													if(
														(
															(rin.jenis_bl == jenis_bl.toLowerCase() && nomor_lampiran == 4)
															|| (rin.jenis_bl == jenis_bl.toLowerCase() && nomor_lampiran == 3)
														)
														&& kelompok.bentuk == (rin.nama_standar_harga.nama_komponen+rin.nama_standar_harga.spek_komponen).trim()
														&& akun[rin.kode_akun]
														&& rin.subs_bl_teks == '[#]'
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
														total_bansos += +rin.rincian;
													}
												});
												console.log('total bansos/hibah barang', dinas.nama, subkeg.nama, total_bansos);
											}else{
												all_rinc.map(function(rin, m){
													if(
														rin.subs_bl_teks == kelompok.nama
														&& kelompok.bentuk == (rin.nama_standar_harga.nama_komponen+rin.nama_standar_harga.spek_komponen).trim()
														&& akun[rin.kode_akun]
													){
														kelompok.data.push(rin);
														nomor++;
														rin.nomor = nomor;
														penerima.push(rin);
													}
												});
												if(kelompok.data.length == 0){
													console.log('Kelompok tidak ditemukan! dinas, subkeg, kelompok', dinas, subkeg, kelompok, all_rinc, akun);
												}
											}
											var penerimaHTML = [];
											var lastpenerima = penerima.length-1;
											penerima.reduce(function(sequence3, nextData3){
									            return sequence3.then(function(current_data3){
									        		return new Promise(function(resolve_reduce3, reject_reduce3){
														getDetailPenerima(subkeg.data.kode_sbl).then(function(all_penerima){
															getDetailRin(dinas.data.id_unit, subkeg.data.kode_sbl, current_data3.id_rinci_sub_bl).then(function(rinci_penerima){
																var alamat = '';
																all_penerima.map(function(p, o){
																	if(p.id_profil == rinci_penerima.id_penerima){
																		alamat = p.alamat_teks+' - '+p.jenis_penerima;
																	}
																});
																penerimaHTML[current_data3.nomor] = ''
																	+'<tr class="tambahan">'
																		+'<td '+_style.td_1+'>'+current_data3.nomor+'</td>'
																		+'<td '+_style.td_2+'>'+current_data3.lokus_akun_teks+'</td>'
																		+'<td '+_style.td_3+'>'+alamat+' ('+current_data3.koefisien+' x '+current_data3.harga_satuan+')</td>'
																		+'<td '+_style.td_4+'>'+current_data3.nama_standar_harga.nama_komponen+'<br>'+current_data3.nama_standar_harga.spek_komponen+'</td>'
																		+'<td '+_style.td_5+'>'+formatRupiah(current_data3.rincian)+'</td>'
																	+'</tr>';
										                    	return resolve_reduce3(nextData3);
															});
														});
									        		})
									                .catch(function(e){
									                    console.log(e);
									                    return Promise.resolve(nextData3);
									                });
									            })
									            .catch(function(e){
									                console.log(e);
									                return Promise.resolve(nextData3);
									            });
									        }, Promise.resolve(penerima[lastpenerima]))
									        .then(function(){
												console.log('dinas, subkeg, kelompok', dinas, subkeg, kelompok);
												jQuery(current_data2).after(penerimaHTML.join(''));
						        				resolve_reduce2(nextData2);
									        })
								            .catch(function(e){
								                console.log(e);
								                resolve_reduce2(nextData2);
								            });
									    })
							            .catch(function(e){
							                console.log(e);
							                resolve_reduce2(nextData2);
							            });
									});
								}else{
									console.log('tr skip', current_data2);
									resolve_reduce2(nextData2);
								}
			                })
			                .catch(function(e){
			                    console.log(e);
			                    return Promise.resolve(nextData2);
			                });
			            })
			            .catch(function(e){
			                console.log(e);
			                return Promise.resolve(nextData2);
			            });
			        }, Promise.resolve(tr[lasttr]))
			        .then(function(){
                		resolve_reduce(nextData);
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
        }, Promise.resolve(table[last]))
        .then(function(){
        	jQuery('#wrap-loading').hide();
        	window.print(true);
        });
	// RINGKASAN APBD YANG DIKLASIFIKASI MENURUT URUSAN PEMERINTAHAN DAERAH DAN ORGANISASI (APBD perda)
	// RINCIAN APBD MENURUT URUSAN PEMERINTAHAN DAERAH, ORGANISASI, PENDAPATAN, BELANJA DAN PEMBIAYAAN (APBD penjabaran)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/2/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		var bidang_urusan = {};
		var skpd = {};
		jQuery('table[cellpadding="3"]>tbody tr').map(function(i, b){
			var td = jQuery(b).find('td');
			var urusan = td.eq(0).text().trim();
			if(isNaN(urusan)){
				return;
			}
			var bidang = td.eq(1).text().trim();
			var nama = td.eq(3).text().trim();
			if(!bidang_urusan[urusan]){
				bidang_urusan = {};
				bidang_urusan[urusan] = {
					nama: nama
				};
			}
			if(bidang && !bidang_urusan[urusan][bidang]){
				bidang_urusan[urusan] = {
					nama: bidang_urusan[urusan].nama
				};
				bidang_urusan[urusan][bidang] = {
					nama: nama
				};
			}
			var kode_unit = td.eq(2).text().trim();
			if(kode_unit){
				var kodes = kode_unit.split('.');
				var cek = false;
				if(bidang_urusan[kodes[0]] && bidang_urusan[kodes[0]][kodes[1]]){
					cek = true;
				}else if(bidang_urusan[kodes[2]] && bidang_urusan[kodes[2]][kodes[3]]){
					cek = true;
				}else if(bidang_urusan[kodes[4]] && bidang_urusan[kodes[4]][kodes[5]]){
					cek = true;
				}
				if(!cek){
					console.log('bidang_urusan', bidang_urusan);
					if(!skpd[kode_unit]){
						skpd[kode_unit] = {
							nama: nama
						};
					}
					if(!skpd[kode_unit][urusan]){
						skpd[kode_unit][urusan] = {
							nama: bidang_urusan[urusan].nama
						};
					}
					if(!skpd[kode_unit][urusan][bidang]){
						skpd[kode_unit][urusan][bidang] = {
							nama: bidang_urusan[urusan][bidang].nama
						}
					}
				}
			}
		});
		// console.log('skpd', skpd);
		var lintas_urusan = '';
		var no = 0;
		for(var i in skpd){
			if(i=='nama'){ continue; }
			for(var j in skpd[i]){
				if(j=='nama'){ continue; }
				for(var k in skpd[i][j]){
					if(k=='nama'){ continue; }
					no++;
					lintas_urusan += ''
						+'<tr>'
							+'<td>'+no+'</td>'
							+'<td class="text_kiri">'+skpd[i].nama+'</td>'
							+'<td class="text_kiri">'+skpd[i][j].nama+'</td>'
							+'<td class="text_kiri">'+skpd[i][j][k].nama+'</td>'
						+'</tr>';
				}
			}
		};
		var skpd_lintas_urusan = ''
			+'<table class="border-table-sce">'
				+'<thead>'
					+'<tr>'
						+'<th colspan="4">Data SKPD Lintas Urusan</th>'
					+'</tr>'
					+'<tr>'
						+'<th>No</th>'
						+'<th>SKPD</th>'
						+'<th>Urusan</th>'
						+'<th>Bidang</th>'
					+'</tr>'
				+'</thead>'
				+'<tbody>'
					+lintas_urusan
				+'</tbody>'
			+'</table>';
		jQuery('#action-sipd').prepend(skpd_lintas_urusan);
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	// RINGKASAN APBD YANG DIKLASIFIKASI MENURUT KELOMPOK DAN JENIS PENDAPATAN, BELANJA, DAN PEMBIAYAAN (APBD perda)
	// RINGKASAN PENJABARAN APBD YANG DIKLASIFIKASI MENURUT KELOMPOK DAN JENIS PENDAPATAN, BELANJA, DAN PEMBIAYAAN (APBD penjabaran)
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/1/'+config.id_daerah+'/setunit') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'head');
		var all_data = {
			nama: 'Total keseluruhan',
			total: 0
		};
		jQuery('table[cellpadding="3"] tbody tr').map(function(i, b){ 
			var td = jQuery(b).find('td');
			var kode = td.eq(0).text().trim().split('.');
			if(isNaN(kode[0]) || td.eq(0).text().trim() == ''){ return; }
			var nilai = +(td.eq(2).text().trim().replace(/\./g,''));
			var nama = td.eq(1).text().trim();
			if(kode.length == 1 && !all_data[kode[0]]){
				all_data[kode[0]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 2 && !all_data[kode[0]][kode[1]]){
				all_data[kode[0]][kode[1]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 3 && !all_data[kode[0]][kode[1]][kode[2]]){
				all_data[kode[0]][kode[1]][kode[2]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 4 && !all_data[kode[0]][kode[1]][kode[2]][kode[3]]){
				all_data[kode[0]][kode[1]][kode[2]][kode[3]] = {
					nama: nama,
					total: 0
				};
			}
			if(kode.length == 5 && !all_data[kode[0]][kode[1]][kode[2]][kode[3]][kode[4]]){
				all_data[kode[0]][kode[1]][kode[2]][kode[3]][kode[4]] = {
					nama: nama,
					total: nilai
				};
				all_data[kode[0]][kode[1]][kode[2]][kode[3]].total += nilai;
				all_data[kode[0]][kode[1]][kode[2]].total += nilai;
				all_data[kode[0]][kode[1]].total += nilai;
				all_data[kode[0]].total += nilai;
				all_data.total += nilai;
			}
		});
		console.log('all_data', all_data);
		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'));
	}else if(current_url.indexOf('dashboard/'+config.tahun_anggaran+'/unit/'+config.id_daerah+'/') != -1){
		console.log('halaman dashboard');
		var master_html = ''
			+'<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">'
            	+'<button onclick="return false;" class="btn btn-primary" id="singkron_master_cse" style="float:right; margin-left: 10px;">Singkron Data Master ke DB Lokal</button>'
            	+'<select class="form-control" style="width: 300px; float: right;" id="data_master_cse">'
            		+'<option value="">Pilih Data Master</option>'
            		+'<option value="penerima_bantuan">Master Data Penerima Bantuan</option>'
            		+'<option value="alamat">Master Data Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan</option>'
            	+'</select>'
        	+'</div>'
		jQuery('.bg-title').append(master_html);
		jQuery('#singkron_master_cse').on('click', function(){
			var val = jQuery('#data_master_cse').val();
			if(val == ''){
				alert('Data Master tidak boleh kosong!');
			}else{
				singkron_master_cse(val);
			}
		});
	}else if(current_url.indexOf('lampiran/'+config.tahun_anggaran+'/apbd/3/'+config.id_daerah+'/0') != -1){
		console.log('halaman perda lampiran 3');
		var download_excel = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="semua-halaman" style="float: right">'
				+'<i class="fa fa-print m-r-5"></i> <span>Print Semua Halaman</span>'
			+'</button>';
		jQuery('.col-md-10 h4').append(download_excel);
		jQuery('#semua-halaman').on('click', function(){
			jQuery('#wrap-loading').show();
			tampil_semua_halaman();
		});
	}else if(current_url.indexOf('setup-user/'+config.tahun_anggaran+'/kel-desa/'+config.id_daerah+'/0') != -1){
		console.log('halaman user kelurahan/desa');
		var singkron_lokal = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-user-deskel-lokal" style="float: right">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron User Pengusul Kelurahan/Desa ke DB Lokal</span>'
			+'</button>';
		jQuery('.p-b-10 .pull-right').append(singkron_lokal);
		jQuery('#singkron-user-deskel-lokal').on('click', function(){
			jQuery('#wrap-loading').show();
			singkron_user_deskel_lokal();
		});
	}else if(current_url.indexOf('budget/analisis/'+config.tahun_anggaran+'/bl/view/'+config.id_daerah+'/0') != -1){
		console.log('halaman analisis belanja');
		if(jQuery('#table_standar_harga').length >= 1){
			var tombol_detil = ''
				+'<button class="fcbtn btn btn-success btn-outline btn-1b" id="detil-analisis-belanja" style="float: right">'
					+'<i class="fa fa-eye m-r-5"></i> <span>Detail Akun/Rekening</span>'
				+'</button>';
			jQuery('.col-md-10 .box-title').append(tombol_detil);
			jQuery('#detil-analisis-belanja').on('click', function(){
				jQuery('#wrap-loading').show();
				detil_analisis_belanja();
			});
		}
	}else if(current_url.indexOf('setup-user/'+config.tahun_anggaran+'/anggota-dewan/'+config.id_daerah+'/0') != -1){
		console.log('halaman user anggota-dewan');
		var singkron_lokal = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron-user-dewan-lokal" style="float: right">'
				+'<i class="fa fa-cloud-download m-r-5"></i> <span>Singkron User Anggota Dewan ke DB Lokal</span>'
			+'</button>';
		jQuery('.p-b-10 .pull-right').append(singkron_lokal);
		jQuery('#singkron-user-dewan-lokal').on('click', function(){
			jQuery('#wrap-loading').show();
			singkron_user_dewan_lokal();
		});
	}
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function tampil_semua_halaman(){
	jQuery.ajax({
		url: config.sipd_url+'daerah/main/budget/lampiran/'+config.tahun_anggaran+'/apbd/tampil-unit/'+config.id_daerah+'/0',
		type: 'get',
		success: function(unit){
			var sendData = unit.data.map(function(b, i){
				return new Promise(function(resolve, reject){
                	jQuery.ajax({
			          	url: config.sipd_url+"daerah/main/budget/jadwal/"+config.tahun_anggaran+"/hist-jadwal/"+config.id_daerah+"/0",
			          	type: "post",
			          	data: "_token="+jQuery('meta[name=_token]').attr('content')+'&app=budget&cetak=apbd&model=perda&jenis=3'+'&idskpd='+b.id_skpd+'&idbl=0&idsubbl=0',
			          	success: function(jadwal){
			          		var url = jQuery(jadwal.data.filter(function(j, n){
			          			return j.setstatus == "Aktif";
			          		})[0].action).attr('href');
			          		b.url = url;
					        // return resolve(b);
			          		jQuery.ajax({
					          	url: url,
					          	type: "get",
					          	success: function(web){
					          		b.web = jQuery('<div>'+web+'</div>').find('.cetak').html();
					          		return resolve(b);
					          	}
					        });
			          	}
			        });
			    })
                .catch(function(e){
                    console.log(e);
                    return Promise.resolve({});
                });
            });
            Promise.all(sendData)
        	.then(function(all_unit){
        		// console.log('all_unit', all_unit);
        		var all_data = [];
        		all_unit.map(function(b, i){
        			all_data.push(b.web);
        		});
        		jQuery('head').html('<title>Sistem Informasi Pemerintahan Daerah - Lampiran 3 APBD</title>');
        		jQuery('body').html('<div class="cetak">'+all_data.join('<div style="page-break-after:always;"></div>')+'</div>');
        		jQuery('#wrap-loading').hide();
        		ttd_kepala_daerah(jQuery('table[cellpadding="3"]>tbody'), 12);
        		window.history.pushState({"html":'',"pageTitle":'good'},"", '/sce');
        		window.print();
            })
            .catch(function(err){
                console.log('err', err);
        		alert('Ada kesalahan sistem!');
        		jQuery('#wrap-loading').hide();
            });
		}
	});
}

function singkron_skpd_ke_lokal(){
	if(confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		jQuery('#wrap-loading').show();
		var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
		jQuery.ajax({
			url: config.sipd_url+'daerah/main/budget/skpd/'+config.tahun_anggaran+'/tampil-skpd/'+config.id_daerah+'/'+id_unit,
			type: 'get',
			success: function(unit){
				var sendData = unit.data.map(function(b, i){
					return new Promise(function(resolve, reject){
	                	jQuery.ajax({
				          	url: config.sipd_url+"daerah/main/budget/skpd/"+config.tahun_anggaran+"/detil-skpd/"+config.id_daerah+"/0",
				          	type: "post",
				          	data: "_token="+jQuery('meta[name=_token]').attr('content')+'&idskpd='+b.id_skpd,
				          	success: function(data){
				          		var data_unit = {
				          			id_setup_unit : b.id_setup_unit,
									id_skpd : b.id_skpd,
									id_unit : b.id_unit,
									is_skpd : b.is_skpd,
									kode_skpd : b.kode_skpd,
									kunci_skpd : b.kunci_skpd,
									nama_skpd : b.nama_skpd,
									posisi : b.posisi,
									status : b.status,
									bidur_1 : data.bidur_1,
									bidur_2 : data.bidur_2,
									bidur_3 : data.bidur_3,
									idinduk : data.idinduk,
									ispendapatan : data.ispendapatan,
									isskpd : data.isskpd,
									kode_skpd_1 : data.kode_skpd_1,
									kode_skpd_2 : data.kode_skpd_2,
									kodeunit : data.kodeunit,
									komisi : data.komisi,
									namabendahara : data.namabendahara,
									namakepala : data.namakepala,
									namaunit : data.namaunit,
									nipbendahara : data.nipbendahara,
									nipkepala : data.nipkepala,
									pangkatkepala : data.pangkatkepala,
									setupunit : data.setupunit,
									statuskepala : data.statuskepala,
				          		};
								return resolve(data_unit);
							},
							error: function(argument) {
								console.log(e);
								return resolve({});
							}
				        });
	                })
	                .catch(function(e){
	                    console.log(e);
	                    return Promise.resolve({});
	                });
				});

	            Promise.all(sendData)
	        	.then(function(all_unit){
	        		var opsi = { 
						action: 'singkron_unit',
						api_key: config.api_key,
						data_unit : all_unit,
						tahun_anggaran : config.tahun_anggaran
					};
					var data = {
					    message:{
					        type: "get-url",
					        content: {
							    url: config.url_server_lokal,
							    type: 'post',
							    data: opsi,
				    			return: true
							}
					    }
					};
					chrome.runtime.sendMessage(data, function(response) {
					    console.log('responeMessage', response);
					});
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

function singkron_rka_ke_lokal_all(opsi_unit, callback) {
	if((opsi_unit && opsi_unit.id_unit) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		jQuery('#wrap-loading').show();
		var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
		if(opsi_unit && opsi_unit.id_unit){
			id_unit = opsi_unit.id_unit;
			var opsi = { 
				action: 'set_unit_pagu',
				api_key: config.api_key,
				tahun_anggaran: config.tahun_anggaran,
				data : {
					batasanpagu : opsi_unit.batasanpagu,
					id_daerah : opsi_unit.id_daerah,
					id_level : opsi_unit.id_level,
					id_skpd : opsi_unit.id_skpd,
					id_unit : opsi_unit.id_unit,
					id_user : opsi_unit.id_user,
					is_anggaran : opsi_unit.is_anggaran,
					is_deleted : opsi_unit.is_deleted,
					is_komponen : opsi_unit.is_komponen,
					is_locked : opsi_unit.is_locked,
					is_skpd : opsi_unit.is_skpd,
					kode_skpd : opsi_unit.kode_skpd,
					kunci_bl : opsi_unit.kunci_bl,
					kunci_bl_rinci : opsi_unit.kunci_bl_rinci,
					kuncibl : opsi_unit.kuncibl,
					kunciblrinci : opsi_unit.kunciblrinci,
					nilaipagu : opsi_unit.nilaipagu,
					nilaipagumurni : opsi_unit.nilaipagumurni,
					nilairincian : opsi_unit.nilairincian,
					pagu_giat : opsi_unit.pagu_giat,
					realisasi : opsi_unit.realisasi,
					rinci_giat : opsi_unit.rinci_giat,
					set_pagu_giat : opsi_unit.set_pagu_giat,
					set_pagu_skpd : opsi_unit.set_pagu_skpd,
					tahun : opsi_unit.tahun,
					total_giat : opsi_unit.total_giat,
					totalgiat : opsi_unit.totalgiat
				}
			};
			var data = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: opsi,
		    			return: false
					}
			    }
			};
			chrome.runtime.sendMessage(data, function(response) {
			    console.log('responeMessage', response);
			});
		}
		jQuery.ajax({
			url: config.sipd_url+'daerah/main/budget/belanja/'+config.tahun_anggaran+'/giat/tampil-giat/'+config.id_daerah+'/'+id_unit,
			type: 'get',
			success: function(subkeg){
				var cat_wp = '';
				var last = subkeg.data.length-1;
				subkeg.data.reduce(function(sequence, nextData){
                    return sequence.then(function(current_data){
                		return new Promise(function(resolve_reduce, reject_reduce){
                        	if(current_data.nama_sub_giat.mst_lock != 3 && current_data.kode_sub_skpd){
                        		cat_wp = current_data.kode_sub_skpd+' '+current_data.nama_sub_skpd;
                        		var nama_skpd = current_data.nama_skpd.split(' ');
                        		nama_skpd.shift();
                        		nama_skpd = nama_skpd.join(' ');
								singkron_rka_ke_lokal({
									id_unit: id_unit,
									kode_bl: current_data.kode_bl,
									kode_sbl: current_data.kode_sbl,
									idbl: current_data.id_bl,
									idsubbl: current_data.id_sub_bl,
									kode_skpd: current_data.kode_skpd,
									nama_skpd: nama_skpd,
									kode_sub_skpd: current_data.kode_sub_skpd,
									pagu: current_data.pagu,
									no_return: true
								}, function(){
									console.log('next reduce', nextData);
									resolve_reduce(nextData);
								});
							}else{
								resolve_reduce(nextData);
							}
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
                }, Promise.resolve(subkeg.data[last]))
                .then(function(data_last){
					if(callback){
						return callback();
					}else{
	                	var opsi = { 
							action: 'get_cat_url',
							api_key: config.api_key,
							category : cat_wp
						};
						var data = {
						    message:{
						        type: "get-url",
						        content: {
								    url: config.url_server_lokal,
								    type: 'post',
								    data: opsi,
					    			return: true
								}
						    }
						};
						chrome.runtime.sendMessage(data, function(response) {
						    console.log('responeMessage', response);
						});
					}
                })
                .catch(function(e){
                    console.log(e);
                });
			}
		});
	}
}

function singkron_rka_ke_lokal(opsi, callback) {
	if((opsi && opsi.kode_bl) || confirm('Apakah anda yakin melakukan ini? data lama akan diupdate dengan data terbaru.')){
		jQuery('#wrap-loading').show();
		var id_unit = window.location.href.split('?')[0].split(''+config.id_daerah+'/')[1];
		if(opsi && opsi.id_unit){
			id_unit = opsi.id_unit;
		}
		var kode_bl = false;
		var kode_sbl = false;
		var idbl = false;
		var idsubbl = false;
		var kode_skpd = false;
		var nama_skpd = false;
		var kode_sub_skpd = false;
		var pagu = 0;
		if(!opsi || !opsi.kode_bl){
			jQuery('script').map(function(i, b){
				var script = jQuery(b).html();
				script = script.split('?kodesbl=');
				if(script.length > 1){
					script = script[1].split("'");
					kode_sbl = script[0];
					var _kode_bl = kode_sbl.split('.');
					_kode_bl.pop();
					kode_bl = _kode_bl.join('.');
					// idbl = script[0];
					// idsubbl = script[1];
				}
			});
		}else{
			kode_bl = opsi.kode_bl;
			kode_sbl = opsi.kode_sbl;
			idbl = opsi.idbl;
			idsubbl = opsi.idsubbl;
			kode_skpd = opsi.kode_skpd;
			nama_skpd = opsi.nama_skpd;
			kode_sub_skpd = opsi.kode_sub_skpd;
			pagu = opsi.pagu;
		}
		if((idbl && idsubbl) || kode_sbl){
			// get detail SKPD
			jQuery.ajax({
				url: config.sipd_url+'daerah/main/budget/skpd/'+config.tahun_anggaran+'/detil-skpd/'+config.id_daerah+'/'+id_unit,
				type: 'post',
				data: "_token="+jQuery('meta[name=_token]').attr('content')+'&idskpd='+id_unit,
				success: function(data_unit){
					// get detail indikator kegiatan
					jQuery.ajax({
						url: config.sipd_url+'daerah/main/budget/belanja/'+config.tahun_anggaran+'/giat/detil-giat/'+config.id_daerah+'/'+id_unit,
						type: 'post',
						data: "_token="+jQuery('meta[name=_token]').attr('content')+'&kodesbl='+kode_sbl,
						success: function(subkeg){
							// subkeg = JSON.parse(subkeg);
							// get rincian belanja
							jQuery.ajax({
								// url: config.sipd_url+'daerah/main/budget/belanja/'+config.tahun_anggaran+'/rinci/tampil-rincian/'+config.id_daerah+'/'+id_unit+'?idbl='+idbl+'&idsubbl='+idsubbl,
								url: config.sipd_url+'daerah/main/budget/belanja/'+config.tahun_anggaran+'/rinci/tampil-rincian/'+config.id_daerah+'/'+id_unit+'?kodesbl='+kode_sbl,
								contentType: 'application/json',
								success: function(data){
									var data_rka = { 
										action: 'singkron_rka',
										tahun_anggaran: config.tahun_anggaran,
										api_key: config.api_key,
										rka : {},
										kode_skpd: kode_skpd,
										nama_skpd: nama_skpd,
										kode_sub_skpd: kode_sub_skpd,
										pagu: pagu,
										idbl: idbl,
										idsubbl: idsubbl,
										kode_bl: kode_bl,
										kode_sbl: kode_sbl,
										data_unit: {},
										dataBl: {},
										dataCapaian: {},
										dataDana: {},
										dataLb7: {},
										dataTag: {},
										dataEs3: {},
										dataHasil: {},
										dataOutput: {},
										dataLokout: {},
										dataOutputGiat: {},
									};
									for(var j in data_unit){
										data_rka.data_unit[j] = data_unit[j];
									}
									subkeg.dataOutputGiat.map(function(d, i){
										data_rka.dataOutputGiat[i] = {};
							            data_rka.dataOutputGiat[i].outputteks = d.outputteks;
							            data_rka.dataOutputGiat[i].satuanoutput = d.satuanoutput;
							            data_rka.dataOutputGiat[i].targetoutput = d.targetoutput;
							            data_rka.dataOutputGiat[i].targetoutputteks = d.targetoutputteks;
									});
									subkeg.dataLokout.map(function(d, i){

									});
									subkeg.dataOutput.map(function(d, i){
										data_rka.dataOutput[i] = {};
										data_rka.dataOutput[i].outputteks = d.outputteks;
							            data_rka.dataOutput[i].targetoutput = d.targetoutput;
							            data_rka.dataOutput[i].satuanoutput = d.satuanoutput;
							            data_rka.dataOutput[i].idoutputbl = d.idoutputbl;
							            data_rka.dataOutput[i].targetoutputteks = d.targetoutputteks;
									});
									subkeg.dataHasil.map(function(d, i){

									});
									subkeg.dataEs3.map(function(d, i){

									});
									subkeg.dataTag.map(function(d, i){
										data_rka.dataTag[i] = {};
							            data_rka.dataTag[i].idlabelgiat = d.idlabelgiat;
							            data_rka.dataTag[i].namalabel = d.namalabel;
							            data_rka.dataTag[i].idtagbl = d.idtagbl;

									});
									subkeg.dataLb7.map(function(d, i){

									});
									subkeg.dataDana.map(function(d, i){
										data_rka.dataDana[i] = {};
							            data_rka.dataDana[i].namadana = d.namadana;
							            data_rka.dataDana[i].kodedana = d.kodedana;
							            data_rka.dataDana[i].iddana = d.iddana;
							            data_rka.dataDana[i].iddanasubbl = d.iddanasubbl;
									});
									subkeg.dataBl.map(function(d, i){
										data_rka.dataBl[i] = {};
										data_rka.dataBl[i].id_sub_skpd = d.id_sub_skpd;
							            data_rka.dataBl[i].id_lokasi = d.id_lokasi;
							            data_rka.dataBl[i].id_label_kokab = d.id_label_kokab;
							            data_rka.dataBl[i].nama_dana = d.nama_dana;
							            data_rka.dataBl[i].no_sub_giat = d.no_sub_giat;
							            data_rka.dataBl[i].kode_giat = d.kode_giat;
							            data_rka.dataBl[i].id_program = d.id_program;
							            data_rka.dataBl[i].nama_lokasi = d.nama_lokasi;
							            data_rka.dataBl[i].waktu_akhir = d.waktu_akhir;
							            data_rka.dataBl[i].pagu_n_lalu = d.pagu_n_lalu;
							            data_rka.dataBl[i].id_urusan = d.id_urusan;
							            data_rka.dataBl[i].id_unik_sub_bl = d.id_unik_sub_bl;
							            data_rka.dataBl[i].id_sub_giat = d.id_sub_giat;
							            data_rka.dataBl[i].label_prov = d.label_prov;
							            data_rka.dataBl[i].kode_program = d.kode_program;
							            data_rka.dataBl[i].kode_sub_giat = d.kode_sub_giat;
							            data_rka.dataBl[i].no_program = d.no_program;
							            data_rka.dataBl[i].kode_urusan = d.kode_urusan;
							            data_rka.dataBl[i].kode_bidang_urusan = d.kode_bidang_urusan;
							            data_rka.dataBl[i].nama_program = d.nama_program;
							            data_rka.dataBl[i].target_4 = d.target_4;
							            data_rka.dataBl[i].target_5 = d.target_5;
							            data_rka.dataBl[i].id_bidang_urusan = d.id_bidang_urusan;
							            data_rka.dataBl[i].nama_bidang_urusan = d.nama_bidang_urusan;
							            data_rka.dataBl[i].target_3 = d.target_3;
							            data_rka.dataBl[i].no_giat = d.no_giat;
							            data_rka.dataBl[i].id_label_prov = d.id_label_prov;
							            data_rka.dataBl[i].waktu_awal = d.waktu_awal;
							            data_rka.dataBl[i].pagu = d.pagu;
							            data_rka.dataBl[i].output_sub_giat = d.output_sub_giat;
							            data_rka.dataBl[i].sasaran = d.sasaran;
							            data_rka.dataBl[i].indikator = d.indikator;
							            data_rka.dataBl[i].id_dana = d.id_dana;
							            data_rka.dataBl[i].nama_sub_giat = d.nama_sub_giat;
							            data_rka.dataBl[i].pagu_n_depan = d.pagu_n_depan;
							            data_rka.dataBl[i].satuan = d.satuan;
							            data_rka.dataBl[i].id_rpjmd = d.id_rpjmd;
							            data_rka.dataBl[i].id_giat = d.id_giat;
							            data_rka.dataBl[i].id_label_pusat = d.id_label_pusat;
							            data_rka.dataBl[i].nama_giat = d.nama_giat;
							            data_rka.dataBl[i].id_skpd = d.id_skpd;
							            data_rka.dataBl[i].id_sub_bl = d.id_sub_bl;
							            data_rka.dataBl[i].nama_sub_skpd = d.nama_sub_skpd;
							            data_rka.dataBl[i].target_1 = d.target_1;
							            data_rka.dataBl[i].nama_urusan = d.nama_urusan;
							            data_rka.dataBl[i].target_2 = d.target_2;
							            data_rka.dataBl[i].label_kokab = d.label_kokab;
							            data_rka.dataBl[i].label_pusat = d.label_pusat;
							            data_rka.dataBl[i].id_bl = d.id_bl;
									});
									subkeg.dataCapaian.map(function(d, i){
										data_rka.dataCapaian[i] = {};
							            data_rka.dataCapaian[i].satuancapaian = d.satuancapaian;
							            data_rka.dataCapaian[i].targetcapaianteks = d.targetcapaianteks;
							            data_rka.dataCapaian[i].capaianteks = d.capaianteks;
							            data_rka.dataCapaian[i].targetcapaian = d.targetcapaian;
									});

									var _leng = 250;
									var _data_all = [];
									var _data = [];
									data.data.map(function(rka, i){
										var _rka = {};
										_rka.created_user = rka.created_user;
										_rka.createddate = rka.createddate;
										_rka.createdtime = rka.createdtime;
										_rka.harga_satuan = rka.harga_satuan;
										_rka.id_daerah = rka.id_daerah;
										_rka.id_rinci_sub_bl = rka.id_rinci_sub_bl;
										_rka.id_standar_nfs = rka.id_standar_nfs;
										_rka.is_locked = rka.is_locked;
										_rka.jenis_bl = rka.jenis_bl;
										_rka.ket_bl_teks = rka.ket_bl_teks;
										_rka.kode_akun = rka.kode_akun;
										_rka.koefisien = rka.koefisien;
										_rka.lokus_akun_teks = rka.lokus_akun_teks;
										_rka.nama_akun = rka.nama_akun;
										if(rka.nama_standar_harga && rka.nama_standar_harga.nama_komponen){
											_rka.nama_komponen = rka.nama_standar_harga.nama_komponen;
											_rka.spek_komponen = rka.nama_standar_harga.spek_komponen;
										}else{
											_rka.nama_komponen = '';
											_rka.spek_komponen = '';
										}
										if(rka.satuan){
											_rka.satuan = rka.satuan;
										}else{
											_rka.satuan = '';
										}
										_rka.spek = rka.spek;
										_rka.subs_bl_teks = rka.subs_bl_teks;
										_rka.total_harga = rka.rincian;
										_rka.rincian = rka.rincian;
										_rka.totalpajak = rka.totalpajak;
										_rka.updated_user = rka.updated_user;
										_rka.updateddate = rka.updateddate;
										_rka.updatedtime = rka.updatedtime;
										_rka.user1 = rka.user1;
										_rka.user2 = rka.user2;
										_rka.id_prop_penerima = 0;
										_rka.id_camat_penerima = 0;
										_rka.id_kokab_penerima = 0;
										_rka.id_lurah_penerima = 0;
										_rka.id_penerima = 0;
										_rka.idkomponen = 0;
										_rka.idketerangan = 0;
										_rka.idsubtitle = 0;
										_data.push(_rka);
										if((i+1)%_leng == 0){
											_data_all.push(_data);
											_data = [];
										}
									});
									if(_data.length > 0){
										_data_all.push(_data);
									}

									var no_excel = 0;
									var last = _data_all.length-1;
									_data_all.reduce(function(sequence, nextData){
						                return sequence.then(function(current_data){
						                	return new Promise(function(resolve_reduce, reject_reduce){
						                		// console.log('current_data', current_data);
						                		var sendData = current_data.map(function(rka, i){
						                			if(!rka.id_rinci_sub_bl){
						                				return Promise.resolve();
						                			}else{
														return getDetailRin(id_unit, kode_sbl, rka.id_rinci_sub_bl, 0).then(function(detail_rin){
															data_rka.rka[i] = rka;
															data_rka.rka[i].id_prop_penerima = detail_rin.id_prop_penerima;
															data_rka.rka[i].id_camat_penerima = detail_rin.id_camat_penerima;
															data_rka.rka[i].id_kokab_penerima = detail_rin.id_kokab_penerima;
															data_rka.rka[i].id_lurah_penerima = detail_rin.id_lurah_penerima;
															data_rka.rka[i].id_penerima = detail_rin.id_penerima;
															data_rka.rka[i].idkomponen = detail_rin.idkomponen;
															data_rka.rka[i].idketerangan = detail_rin.idketerangan;
															data_rka.rka[i].idsubtitle = detail_rin.idsubtitle;
															if(!opsi){
																no_excel++;
																var tbody_excel = ''
																	+'<tr>'
																		+'<td style="mso-number-format:\@;">'+no_excel+'</td>'
																		+'<td style="mso-number-format:\@;">'+kode_sbl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].jenis_bl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idsubtitle+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].subs_bl_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idketerangan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].ket_bl_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].kode_akun+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_akun+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].nama_komponen+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].spek_komponen+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].koefisien+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].satuan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].harga_satuan+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].totalpajak+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].rincian+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_rinci_sub_bl+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].lokus_akun_teks+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_prop_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_camat_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_kokab_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].id_lurah_penerima+'</td>'
																		+'<td style="mso-number-format:\@;">'+data_rka.rka[i].idkomponen+'</td>'
																	+'</tr>';
																jQuery('#data_rin_excel').append(tbody_excel);
																console.log('data_rka.rka[i]', data_rka.rka[i]);
															}
														});
													}
						                		});
												Promise.all(sendData)
									        	.then(function(val_all){
													var data = {
													    message:{
													        type: "get-url",
													        content: {
															    url: config.url_server_lokal,
															    type: 'post',
															    data: data_rka,
												    			return: false
															}
													    }
													};
													chrome.runtime.sendMessage(data, function(response) {
													    console.log('responeMessage', response);
													    return resolve_reduce(nextData);
													});
									            })
									            .catch(function(err){
									                console.log('err', err);
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
						            }, Promise.resolve(_data_all[last]))
						            .then(function(data_last){
						            	console.log('opsi', opsi);
										if(!opsi || !opsi.no_return){
											alert('Berhasil Singkron RKA ke DB lokal!');
											jQuery('#wrap-loading').hide();
											jQuery('#download_data_excel').show();
										}
						            	if(callback){
									    	callback();
									    }
						            });
								}
							});
						}
					});
				}
			});
		}else{
			alert('ID Belanja tidak ditemukan!');
			jQuery('#wrap-loading').hide();
		}
	}
}