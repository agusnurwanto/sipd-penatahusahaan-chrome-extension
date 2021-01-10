// http://swwwitch.com/dl/Font-Awesome-Cheetsheet-4.5.0.pdf
jQuery(document).ready(function(){
	var loading = ''
		+'<div id="wrap-loading">'
	        +'<div class="lds-hourglass"></div>'
	        +'<div id="persen-loading"></div>'
	    +'</div>';
	jQuery('body').prepend(loading);
	var current_url = window.location.href;

	if(current_url.indexOf('siap/dpa-bl-rinci/cetak/daerah/main/budget/'+config.tahun_anggaran+'/'+config.id_daerah+'/') != -1){
		injectScript( chrome.extension.getURL('/js/jquery.min.js'), 'html');
		if(config.tgl_dpa){
			var tgl = get_tanggal();
			var tgl_dpa = jQuery('table.tabel-standar').eq(37).find('td').eq(0);
			tgl_dpa.text(tgl_dpa.text().replace(/\./g, '')+' '+tgl);
		}
		run_download_excel();
		var button_ind = ''
			+'<label><input type="radio" id="load_ind"> Munculkan indikator dari RKA</label>';
		jQuery('#action-sipd').append(button_ind);
		jQuery('#load_ind').on('click', function(){
			var kode_giat = get_kode_giat_laporan();
			jQuery('#wrap-loading').show();
			var data_ind = { 
				action: 'get_indikator',
				tahun_anggaran: config.tahun_anggaran,
				api_key: config.api_key,
				kode_giat: kode_giat
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