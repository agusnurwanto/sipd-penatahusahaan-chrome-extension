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
	if(request.type == 'response-fecth-url'){
		var res = request.data;
		console.log(request.data);
		if(res.action && res.action=='get_unit'){
			var input = ''
				+'<div class="col-md-6 m-b-md">'
					+'<div class="app-input-text">'
						+'<label class="app-input-text__label">SKPD dari Extension</label>'
		        		+'<input type="text" class="app-input-text__input" disabled value="'+res.data[0].nama_skpd+'"/>'
	        		+'</div>'
	        	+'</div>';
			jQuery('app-input-text[ng-model="formTambah.skpd.namaSkpd"]').parent().after(input);
			window.allUnitSCE = res.data[0];
			get_unit(allUnitSCE);
		}else if(res.action && res.action=='get_indikator'){
			// sasaran program
			var sasaran = res.data.renstra[0].sasaran_teks.replace('Sasaran : ', '');
			jQuery('table[cellpadding="2"]').eq(0).find('>tbody>tr').eq(3).find('>td').eq(2).text(sasaran);

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
			jQuery('table[cellpadding="2"]').eq(0).find('>tbody>tr').eq(4).find('table tbody').append(tr_ind_prog);
			var table_giat = jQuery('table[cellpadding="5"]').eq(2);

			// capaian kegiatan
			table_giat.find('>tbody>tr').eq(1).find('>td').eq(1).find('table>tbody').append(tr_ind_capaian);
			table_giat.find('>tbody>tr').eq(1).find('>td').eq(2).find('table>tbody').append(tr_target_ind_capaian);

			// keluaran kegiatan
			var tr_ind_keluaran = '';
			var tr_target_ind_keluaran = '';
			res.data.output.map(function(b, i){
				tr_ind_keluaran += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.outputteks+'</td></tr>';
				tr_target_ind_keluaran += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.targetoutputteks+'</td></tr>';
			})
			table_giat.find('>tbody>tr').eq(3).find('>td').eq(1).find('table>tbody').append(tr_ind_keluaran);
			table_giat.find('>tbody>tr').eq(3).find('>td').eq(2).find('table>tbody').append(tr_target_ind_keluaran);

			// hasil kegiatan
			var tr_target_ind_hasil = '';
			var tr_ind_hasil = '';
			res.data.hasil.map(function(b, i){
				tr_ind_hasil += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.hasilteks+'</td></tr>';
				tr_target_ind_hasil += ''
					+'<tr><td width="495" style=" mso-number-format:\@;">'+b.targethasilteks+'</td></tr>';
			})
			table_giat.find('>tbody>tr').eq(4).find('>td').eq(1).find('table').append(tr_ind_hasil);
			table_giat.find('>tbody>tr').eq(4).find('>td').eq(2).find('table').append(tr_target_ind_hasil);

			// kelompok sasaran
			if(res.data.bl[0]){
				var td_sasaran = jQuery('table[cellpadding="1"]>tbody>tr').eq(4).find('td');
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