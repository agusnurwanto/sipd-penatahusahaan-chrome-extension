// console.log('run content_script.js');

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    // th.appendChild(s);
    th.insertBefore(s, th.firstChild);
}
injectScript( chrome.extension.getURL('/config.js'), 'html');


var data = {
    message:{
        type: "get-actions"
    }
};
chrome.runtime.sendMessage(data, function(response) {
    console.log('responeMessage', response);
});

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log('sender, request', sender, request);
	var current_url = window.location.href;
	if(request.type == 'response-fecth-url'){
		var res = request.data;
		console.log(request.data);
		if(res.action && res.action=='get_unit'){
			if(current_url.indexOf('siap/login') != -1){
				var opsi = ['<option value="">Login PA pilih ID SKPD</option>'];
				res.data.map(function(b, i){
					var selected = "";
					opsi.push('<option value="_'+config.id_daerah+'_'+b.id_skpd+'">'+b.id_skpd+' '+b.nama_skpd+'</option>');
				});
				jQuery('#pilih_skpd').html(opsi.join(''));
				jQuery('#pilih_skpd').select2();
			}else{
				var input = ''
					+'<div class="col-md-6 m-b-md">'
						+'<div class="app-input-text">'
							+'<label class="app-input-text__label">SKPD dari Extension</label>'
			        		+'<input type="text" class="app-input-text__input" disabled value="'+res.data[0].nama_skpd+'"/>'
		        		+'</div>'
		        	+'</div>';
				jQuery('app-input-text[ng-model="formTambah.skpd.namaSkpd"]').parent().after(input);
				window.allUnitSCE = res.data[0];
				get_unit(allUnitSCE); // promise resolve
			}
		}else if(res.action && res.action=='get_all_sub_unit'){
			var opsi = ['<option value="">Ganti ID SKPD</option>'];
			res.data.map(function(b, i){
				var selected = "";
				if(b.id_skpd == res.id_skpd){
					selected = "selected"
				}
				opsi.push('<option '+selected+' value="'+b.id_skpd+'">'+b.id_skpd+' '+b.nama_skpd+'</option>');
			});
			jQuery('#pilih_skpd').html(opsi.join(''));
		}else if(res.action && res.action=='get_indikator'){
			// sasaran program
			if(res.data.renstra[0] && res.data.renstra[0].sasaran_teks){
				var sasaran = res.data.renstra[0].sasaran_teks.replace('Sasaran : ', '');
				jQuery('table.tabel-standar[cellpadding="4"]').eq(4).find('td').eq(2).text(sasaran);
			}

			// indikator program
			var tr_ind_prog = '';
			var tr_ind_capaian = '';
			var tr_target_ind_capaian = '';
			res.data.ind_prog.map(function(b, i){
				tr_ind_prog += ''
					+'<tr><td style=" mso-number-format:\@;">'+b.capaianteks+'</td><td style=" mso-number-format:\@;">'+b.targetcapaianteks+'</td></tr>';
				tr_ind_capaian += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.capaianteks+'</td></tr>';
				tr_target_ind_capaian += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.targetcapaianteks+'</td></tr>';
			});
			jQuery('table.tabel-standar').eq(7).find('>tbody').html(tr_ind_prog);
			var table_giat = jQuery('table[cellpadding="5"]').eq(2);

			// capaian kegiatan
			jQuery('table.tabel-standar').eq(15).find('>tbody').html(tr_ind_capaian);
			jQuery('table.tabel-standar').eq(16).find('>tbody').html(tr_target_ind_capaian);

			// keluaran kegiatan
			var tr_ind_keluaran = '';
			var tr_target_ind_keluaran = '';
			res.data.output.map(function(b, i){
				tr_ind_keluaran += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.outputteks+'</td></tr>';
				tr_target_ind_keluaran += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.targetoutputteks+'</td></tr>';
			})
			jQuery('table.tabel-standar').eq(19).find('>tbody').html(tr_ind_keluaran);
			jQuery('table.tabel-standar').eq(20).find('>tbody').html(tr_target_ind_keluaran);

			// hasil kegiatan
			var tr_target_ind_hasil = '';
			var tr_ind_hasil = '';
			res.data.hasil.map(function(b, i){
				tr_ind_hasil += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.hasilteks+'</td></tr>';
				tr_target_ind_hasil += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.targethasilteks+'</td></tr>';
			})
			jQuery('table.tabel-standar').eq(21).html(tr_ind_hasil);
			jQuery('table.tabel-standar').eq(22).html(tr_target_ind_hasil);

			// kelompok sasaran
			if(res.data.bl[0]){
				var td_sasaran = jQuery('#rka>tbody>tr').eq(15).find('td');
				var kelompok_sasaran = td_sasaran.text()+' '+res.data.bl[0]['sasaran'];
				td_sasaran.text(kelompok_sasaran);
			}
		}else{
			alert(res.message);
		}
		jQuery('#wrap-loading').hide();
		jQuery('#persen-loading').html('');
		jQuery('#persen-loading').attr('persen', '');
		jQuery('#persen-loading').attr('total', '');
	}else if(request.type == 'response-actions'){
		
	}
	return sendResponse("THANKS from content_script!");
});

// injectScript( chrome.extension.getURL('/js/content/app.js'), 'html');