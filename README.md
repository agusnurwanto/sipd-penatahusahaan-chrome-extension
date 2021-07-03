# sipd-penatausahaan-chrome-extension
Optimasi aplikasi SIPD dengan chrome extension
Semoga bermanfaat

### DONASI
- Donasi untuk pengembang aplikasi, klik di link ini https://smkasiyahhomeschooling.blogspot.com/p/donasi-pengembangan-smk-asiyah.html

### GRUP telegram https://t.me/sipd_chrome_extension

### Plugin Wordpress WP-SIPD https://github.com/agusnurwanto/wp-sipd

### Pesan Untuk Tim Pengembang SIPD
- Semoga selalu diberi kesehatan dan aplikasi SIPD lancar digunakan oleh pemda
- Extension ini dibuat untuk mengoptimasi kinerja aplikasi SIPD
- Pengembangan script extension akan berhenti setelah aplikasi SIPD siap untuk mengakomodir semua fitur yang diperlukan oleh pemda
- Demikian dan salam semangat :blush:

### Fitur:
- Memampilkan indikator DPA dari data RKA
- Edit manual indikator DPA
- Menampilkan anggaran kas di DPA
- Load data UP dari aplikasi lokal
- Save UP Lokal by script
- Perbaikan script singkron RAK setelah ada update di SIPD
- Hapus RAK yang rincian belanjanya 0 atau selisihnya minus
- Singkron User penatausahaan
- Singkron data pendahuluan (TAPD dan SEKDA)
- Menampilkan link print DPA lokal

### Pengembangan berikutnya:
- Melengkapi dokumentasi penggunaan di halaman wiki
- Melengkapi video tutorial di youtube

### Video tutorial
- Singkron RKA SKPD ke DB lokal dan menampilkan indikator kegiatan dari data RKA di laporan DPA https://youtu.be/LjHqKYT2C-M
- Integrasi data SIPD ke SIMDA keuangan https://youtu.be/vFOsAlnxmTo

### Istilah di Aplikasi Penatausahaan
- Surat Penyediaan Dana yang selanjutnya disingkat SPD adalah dokumen yang menyatakan tersedianya dana untuk melaksanakan kegiatan sebagai dasar penerbitan SPP (Surat Permintaan Pembayaran).
- Surat Perintah Membayar Langsung, yang selanjutnya disingkat SPM-LS, adalah SPM langsung kepada Bendahara Pengeluaran/Penerima Hak yang diterbitkan oleh PA/KPA atau pejabat lain yang ditunjuk atas dasar kontrak kerja, surat keputusan, surat tugas atau surat perintah kerja lainnya.
- Catatan dari manual book SIPD Penatausahaan https://agusnurwantomuslim.blogspot.com/2021/02/sipd-penatausahaan-kemendagri.html

### Catatan
- Untuk melihat data besaran UP di SIPD penatausahaan.
```
jQuery.ajax({
	url: config.sipd_url+'siap/data/besaran-up-skpd',
	type: 'get',
	success: function(res){
		console.log(res);
	}
});
```
- Untuk mengedit nilai besaran UP ketika salah input.
```
jQuery.ajax({
	url: config.sipd_url+'siap/edit/skkdh',
	type: 'post',
	data: {
		nilaiMaksimal: 0, // dibuat sama dengan nilau UP saja
		nilaiBesaranUp: 0, // nilai besaran UP
		idBesaranUp: 0, // ID yang didapat dari config.sipd_url+'siap/data/besaran-up-skpd'
		idSkpd: 0, //  ID yang didapat dari config.sipd_url+'siap/data/besaran-up-skpd'
		idDaerah: config.id_daerah
	},
	success: function(res){
		alert('Berhasil');
	}
});
```
- Untuk menambah SPD kirim request post ke ```config.sipd_url+'siap/spd/tambah'```
- Untuk membuat SPTJM SPM request post ke ```config.sipd_url+'siap/spm/tambah-sptjm'```
```
{
	"nomorSpm":"xxxxx",
	"tanggalSpm":"yyyy-mm-dd",
	"nilaiSpm":"xxxx",
	"id_spm":xxx,
	"id_jadwal":xxx,
	"id_tahap":xxx,
	"status_tahap":"xxx",
	"nomor_sptjm":"xxxxx",
	"tanggal_sptjm":"dd/mm/yyyy"
}
```