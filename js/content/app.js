// http://swwwitch.com/dl/Font-Awesome-Cheetsheet-4.5.0.pdf
jQuery(document).ready(function(){
	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	    +'</div>';
	if(jQuery('#wrap-loading').length == 0){
		jQuery('body').prepend(loading);
	}
	var current_url = window.location.href;

	if(jQuery('input#email[name="userName"]').length >= 1){
		var pilih_skpd = ''
			+'<div style="margin-bottom: 20px;">'
				+'<select class="input-xl form-control input-dark m-b-md" id="pilih_skpd">'
					+'<option value="">Login PA pilih ID SKPD</option>'
				+'</select>'
			+'</div>';
		jQuery('#email').before(pilih_skpd);
		jQuery('#idDaerah').val(config.id_daerah);
		getAllUnit();
		jQuery('#pilih_skpd').on('change', function(){
			var val = jQuery(this).val();
			jQuery('#email').val(val);
		});
	}else if(
		current_url.indexOf('siap/rak-belanja/rak-detil/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/rak-pendapatan/list/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/rak-pembiayaan/list/penerimaan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/rak-pembiayaan/list/pengeluaran/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
	){
		var tombol_singkron = ''
			+'<div class="col-md-3 col-xs-12">'
				+'<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>'
			+'</div>';
		jQuery('.panel.panel-primary').closest('.row').append(tombol_singkron);
		jQuery('#singkron_rak_ke_lokal').on('click', function(){
			var type = 'belanja';
			if(current_url.indexOf('siap/rak-pendapatan/list/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1){
				type = 'pendapatan';
			}else if(current_url.indexOf('siap/rak-pembiayaan/list/penerimaan/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1){
				type = 'pembiayaan-penerimaan';
			}else if(current_url.indexOf('siap/rak-pembiayaan/list/pengeluaran/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1){
				type = 'pembiayaan-pengeluaran';
			}
			singkron_rak_ke_lokal({type: type});
		});
	}else if(current_url.indexOf('siap/rak-belanja/list/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1){
		var tombol_singkron = ''
			+'<button class="fcbtn btn btn-danger btn-outline btn-1b pull-right" id="singkron_rak_ke_lokal" style="margin-right: 20px;"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>';
		jQuery('a.btn-circle.pull-right').after(tombol_singkron);
		jQuery('#singkron_rak_ke_lokal').on('click', function(){
			singkron_rak_ke_lokal_all();
		});
	}else if(
		current_url.indexOf('siap/dpa-bl-rinci/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/dpa-biaya/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/dpa-bl/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/dpa-penda/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
		|| current_url.indexOf('siap/dpa-skpd/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1
	){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'html');

		var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
		if(cek_no_dpa == 'Nomor DPA'){
			if(config.nip_ppkd){
				jQuery('.text-merah.text_blok.text_20').hide();
				var ttd_ppkd = ''
					+'<tr><td class="text_tengah"><br>Mengesahkan,</td></tr>'
					+'<tr><td class="text_tengah" style="font-size: 110%; text-align: center; mso-number-format:\@;">PPKD</td></tr>'
	                +'<tr><td height="80" style=" mso-number-format:\@;">&nbsp;</td></tr>'
	                +'<tr><td class="text_tengah" style=" text-align: center; mso-number-format:\@;">'+config.nama_ppkd+'</td></tr>'
	                +'<tr><td class="text_tengah" style=" text-align: center; mso-number-format:\@;">NIP. '+config.nip_ppkd+'</td></tr>';
				var rak = jQuery('table[class="tabel-standar"]');
				if(rak.eq(rak.length-2).find('>tbody .tabel-standar tbody>tr').eq(7).text() != 'PPKD'){
					rak.eq(rak.length-2).find('>tbody .tabel-standar tbody').append(ttd_ppkd);
				}
			}
		}


		if(config.print_magic){
			jQuery('.cetak>table.tabel-standar[cellpadding="4"]').map(function(i, b){
				if(i%2 != 0){
					return;
				}else{
					jQuery(b).css('page-break-before', 'always');
				}
			});
			var rak = jQuery('table[class="tabel-standar"]');
			rak.eq(rak.length-3).css('page-break-before', 'always');
		}

		if(config.tgl_dpa){
			var tgl = get_tanggal();
			var tgl_dpa = jQuery('table.tabel-standar').eq(37).find('td').eq(0);
			tgl_dpa.text(tgl_dpa.text().replace(/\./g, '')+' '+tgl);
		}
		run_download_excel();
		var display = "display: none;";
		if(config.manual_indikator){
			display = "";
		}
		var button_ind = ''
			+'<select id="pilih_skpd" style="min-width: 200px; margin: 0 5px 0 10px; height: 30px;"><option value="">Ganti ID SKPD</option></select><br><br>'
			+'<label><input type="radio" id="load_ind"> Munculkan indikator dari RKA DB Lokal</label>'
			+'<label style="'+display+'"><input type="radio" id="edit_ind"> Edit indikator Manual</label>'
			+'<label><input type="radio" id="load_kas"> Munculkan Anggaran Kas DB Lokal</label>';
		jQuery('#action-sipd').append(button_ind);
		var id_skpd = get_id_skpd_laporan(current_url);
		jQuery('#wrap-loading').show();
		var data_ind = { 
			action: 'get_all_sub_unit',
			tahun_anggaran: config.tahun_anggaran,
			api_key: config.api_key,
			id_skpd: id_skpd
		};
		var data_back = {
		    message:{
		        type: "get-url",
		        content: {
				    url: config.url_server_lokal,
				    type: 'post',
				    data: data_ind,
	    			return: true
				}
		    }
		};
		chrome.runtime.sendMessage(data_back, function(response) {
		    console.log('responeMessage', response);
		});
		jQuery('#load_kas').on('click', function(){
			if(confirm('Data Anggaran Kas akan diupdate sesuai dengan data di database lokal!')){
				var no_eq = 0;
				var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
				if(cek_no_dpa == 'Nomor DPA'){
					no_eq = 1;
				}
				var kode_giat = get_kode_giat_laporan(no_eq);
				var kode_skpd = get_kode_skpd_laporan(no_eq);
				jQuery('#wrap-loading').show();
				var data_ind = { 
					action: 'get_kas',
					tahun_anggaran: config.tahun_anggaran,
					api_key: config.api_key,
					kode_giat: kode_giat,
					kode_skpd: kode_skpd
				};
				var data_back = {
				    message:{
				        type: "get-url",
				        content: {
						    url: config.url_server_lokal,
						    type: 'post',
						    data: data_ind,
			    			return: true
						}
				    }
				};
				chrome.runtime.sendMessage(data_back, function(response) {
				    console.log('responeMessage', response);
				});
				console.log('kode_giat', kode_giat);
			}else{
				jQuery('#load_kas').prop('checked', false);
			}
		});
		jQuery('#pilih_skpd').on('change', function(){
			var val = jQuery(this).val();
			if(val != ''){
				window.location.href = current_url.replace('/'+id_skpd+'?','/'+val+'?');
			}
		});
		jQuery('#edit_ind').on('click', function(){
			alert('Silahkan klik pada kolom indikator yang masih kosong untuk melakukan edit!');

			var no_eq = 0;
			var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
			if(cek_no_dpa == 'Nomor DPA'){
				no_eq = 1;
			}

			var sasaran_program = jQuery('table.tabel-standar[cellpadding="4"]').eq(4+no_eq).find('td').eq(2);
			sasaran_program.attr('contenteditable', true);
			
			var ind_prog = jQuery('table.tabel-standar').eq(7+no_eq).find('>tbody');
			ind_prog.attr('contenteditable', true);

			var capaian_kegiatan = jQuery('table.tabel-standar').eq(15+no_eq).find('>tbody');
			capaian_kegiatan.attr('contenteditable', true);

			var target_capaian_kegiatan = jQuery('table.tabel-standar').eq(16+no_eq).find('>tbody');
			target_capaian_kegiatan.attr('contenteditable', true);

			var keluaran_kegiatan = jQuery('table.tabel-standar').eq(19+no_eq).find('>tbody');
			keluaran_kegiatan.attr('contenteditable', true);

			var target_keluaran_kegiatan = jQuery('table.tabel-standar').eq(20+no_eq).find('>tbody');
			target_keluaran_kegiatan.attr('contenteditable', true);

			var hasil_kegiatan = jQuery('table.tabel-standar').eq(21+no_eq);
			if(hasil_kegiatan.find('tr').length == 0){
				hasil_kegiatan.append('<tr><td contenteditable="true"></td></tr>');
			}else{
				hasil_kegiatan.find('tr>td').attr('contenteditable', true);
			}

			var target_hasil_kegiatan = jQuery('table.tabel-standar').eq(22+no_eq);
			if(target_hasil_kegiatan.find('tr').length == 0){
				target_hasil_kegiatan.append('<tr><td contenteditable="true"></td></tr>');
			}else{
				target_hasil_kegiatan.find('tr>td').attr('contenteditable', true);
			}

			var kelompok_sasaran = jQuery('#rka>tbody>tr').eq(15+no_eq).find('td');
			kelompok_sasaran.attr('contenteditable', true);

			var rak = jQuery('table[class="tabel-standar"]');
			rak.eq(rak.length-2).find('>tbody').attr('contenteditable', true);

			if(config.manual_indikator_sub_keg){
				jQuery('.cetak>table.tabel-standar[cellpadding="4"]').map(function(i, b){
					if(i%2 != 0){
						return;
					}
					var eq_1 = 5;
					if(i==0){
						eq_1 = 4;
					}
					jQuery(b).find('>tbody>tr').eq(eq_1)
						.find('.tabel-standar').eq(1)
						.find('>tbody').attr('contenteditable', true);
				});
			}
		});
		jQuery('#load_ind').on('click', function(){
			var no_eq = 0;
			var cek_no_dpa =jQuery('table.tabel-standar').eq(2).find('>tbody>tr>td').eq(0).text().trim();
			if(cek_no_dpa == 'Nomor DPA'){
				no_eq = 1;
			}
			var kode_giat = get_kode_giat_laporan(no_eq);
			var kode_skpd = get_kode_skpd_laporan(no_eq);
			jQuery('#wrap-loading').show();
			var data_ind = { 
				action: 'get_indikator',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				kode_giat: kode_giat,
				kode_skpd: kode_skpd
			};
			var data_back = {
			    message:{
			        type: "get-url",
			        content: {
					    url: config.url_server_lokal,
					    type: 'post',
					    data: data_ind,
		    			return: true
					}
			    }
			};
			chrome.runtime.sendMessage(data_back, function(response) {
			    console.log('responeMessage', response);
			});
			console.log('kode_giat', kode_giat);
		});
	}else if(current_url.indexOf('/siap/kelola-user') != -1){
		getUser(idUser()).then(function(skpd){
			if(skpd == ''){
				getAllUnit(idSkpd()).then(function(all_unit){
					console.log('all_unit', all_unit);
				});
				var simpan = '<button class="btn input-xl m-t-md btn-danger" id="btnSubmitCE" onclick="return false;"><i class="fa fa-plus m-r-xs "></i>Simpan by Chrome Extension</button>';
				jQuery('#btnLoad').after(simpan);
				jQuery('#btnSubmitCE').on('click', function(){
					getAllUnit(idSkpd()).then(function(skpd){
						getJabatan().then(function(jab){
							var nip = jQuery('app-input-text[ng-model="formTambah.nip"] input').val();
							if(!nip){
								return alert('nip tidak boleh kosong!');
							}else if(nip.length != 18){
								return alert('NIP harus 18 karakter!');
							}
							var fullName = jQuery('app-input-text[ng-model="formTambah.fullName"] input').val();
							if(!fullName){
								return alert('nip tidak boleh kosong!');
							}
							var nomorHp = jQuery('app-input-text[ng-model="formTambah.nomorHp"] input').val();
							if(!nomorHp){
								return alert('Nomor HP tidak boleh kosong!');
							}
							var rank = jQuery('app-input-text[ng-model="formTambah.rank"] input').val();
							if(!rank){
								return alert('Pangkat tidak boleh kosong!');
							}
							var group = jQuery('app-input-text[ng-model="formTambah.group"] input').val();
							if(!group){
								return alert('Golongan tidak boleh kosong!');
							}
							var npwp = jQuery('app-input-text[ng-model="formTambah.npwp"] input').val();
							if(!npwp){
								return alert('NPWP tidak boleh kosong!');
							}else if(npwp.length != 15){
								return alert('NPWP harus 15 karakter!');
							}
							var jabatan = jQuery('searchable-dropdown[ng-model="formTambah.jabatan"] input').val();
							if(!jabatan){
								return alert('Jabatan tidak boleh kosong!');
							}
							var userName = jQuery('app-input-text[ng-model="formTambah.userName"] input').val();
							if(!userName){
								return alert('Username tidak boleh kosong!');
							}
							var password = jQuery('app-input-text[ng-model="formTambah.password"] input').val();
							if(!password){
								return alert('Password tidak boleh kosong!');
							}
							var konfirmasiPassword = jQuery('app-input-text[ng-model="formTambah.konfirmasiPassword"] input').val();
							if(!konfirmasiPassword){
								return alert('Konfirmasi password tidak boleh kosong!');
							}
							var c_jabatan = false;
							jab.map(function(b, i){
								if(b.namaJabatan == jabatan){
									c_jabatan = b;
								}
							});
							if(!c_jabatan){
								return  alert('Data jabatan kosong! Hubungi superman :)');
							}
							var data_user = {
								"skpd":{
									"idSkpd":skpd.id_skpd,
									"namaSkpd":skpd.nama_skpd,
									"kodeSkpd":skpd.kode_skpd,
									"idDaerah":config.id_daerah
								},
								"userName":userName,
								"nip":nip,
								"fullName":fullName,
								"nomorHp":nomorHp,
								"rank":rank,
								"npwp":npwp,
								"jabatan":{
									"idJabatan":c_jabatan.idJabatan,
									"namaJabatan":c_jabatan.namaJabatan,
									"idRole":c_jabatan.idRole,
									"order":c_jabatan.order,
									"label":c_jabatan.namaJabatan,
									"value":c_jabatan.idJabatan,
								},
								"kpa":null,
								"bank":null,
								"group":group,
								"password":password,
								"konfirmasiPassword":konfirmasiPassword
							};
							console.log('data_user', data_user);
							tambahUser(data_user);
						});
					});
				});
			}
		});
	}
});