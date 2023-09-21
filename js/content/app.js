// http://swwwitch.com/dl/Font-Awesome-Cheetsheet-4.5.0.pdf
jQuery(document).ready(function () {
  var loading =
    "" +
    '<div id="wrap-loading">' +
    '<div class="lds-hourglass"></div>' +
    '<div id="persen-loading"></div>' +
    "</div>";
  if (jQuery("#wrap-loading").length == 0) {
    jQuery("body").prepend(loading);
  }
  var current_url = window.location.href;

  if (jQuery('input#email[name="userName"]').length >= 1) {
    var pilih_skpd =
      "" +
      '<div style="margin-bottom: 20px;">' +
      '<select class="input-xl form-control input-dark m-b-md" id="pilih_skpd">' +
      '<option value="">Login PA pilih ID SKPD</option>' +
      "</select>" +
      "</div>";
    jQuery("#email").before(pilih_skpd);
    jQuery("#idDaerah").val(config.id_daerah);
    getAllUnit();
    jQuery("#pilih_skpd").on("change", function () {
      var val = jQuery(this).val();
      jQuery("#email").val(val);
    });
  }else if(current_url.indexOf("siap/sp2d")!=-1){
    var id_user=idUser();
    var tombol_singkron='<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-success btn-1b" id="singkron_sp2d_lokal"><i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron SP2D ke DB lokal</span></button></li>'+
    '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-success btn-1b" id="singkron_spm_lokal"><i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron SPM ke DB lokal</span></button></li>'+
    '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-success btn-1b" id="singkron_spp_lokal"><i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron SPP ke DB lokal</span></button></li>';
    jQuery('ul.breadcrumb').append(tombol_singkron);
    //singkronisasi SPP ke database lokal
    $('#singkron_spp_lokal').on('click',()=>{
      if(confirm("Apakah anda yakin untk melakukan singkronisasi SPP? data lokal akan diupdate!")){
        jQuery("#wrap-loading").show();
        singkron_spp_ke_lokal();
      }
    })
    //singkronisasi SPM ke database lokal
    $('#singkron_spm_lokal').on('click',()=>{
        if(confirm("Apakah anda yakin untk melakukan singkronisasi SPM? data lokal akan diupdate!")){
            jQuery("#wrap-loading").show();
            singkron_spm_ke_lokal_pemda();
        }
    })
    //singkronisasi SP2D ke database lokal
    $('#singkron_sp2d_lokal').on('click',()=>{
      if(confirm("Apakah anda yakin untk melakukan singkronisasi SP2D? data lokal akan diupdate!")){
        jQuery("#wrap-loading").show();
        singkron_sp2d_ke_lokal();
      }
    })

  }else if(current_url.indexOf("siap/spd")!=-1) {
	var id_user=idUser();
		var tombol_singkron=
		"" +
        '<li class="pull-right" style="padding: 2px 10px;">' +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_spd_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron SPD DB Lokal</span></button>' +
        "</li>";
		jQuery("ul.breadcrumb").append(tombol_singkron)
		jQuery("#singkron_spd_ke_lokal").on('click',function(){
			if (
				confirm(
				  "Apakah anda yakin untuk melakukan singkronisasi RAK? data di lokal akan diupdate!"
				)){
					singkron_spd_ke_lokal_all_pemda();
				}
		})
  }else if (
    current_url.indexOf("siap/rak-belanja/rak-detil") != -1 ||
    current_url.indexOf("siap/rak-pendapatan/list") != -1 ||
    current_url.indexOf("siap/rak-pembiayaan/list") != -1
  ) {
    var id_user = idUser();
    getUser(id_user).then(function (user) {
      var hapus_rak = "";
      if (user.idJabatan == 15) {
        hapus_rak =
          '<button style="margin-left: 10px;" class="btn btn-danger btn-1b" id="hapus_rak_all"><i class="fa fa-trash m-r-5"></i> <span>Hapus RAK [-]</span></button>';
      }
      var tombol_singkron =
        "" +
        '<div class="col-md-3 col-xs-12">' +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>RAK DB Lokal</span></button>' +
        hapus_rak +
        "</div>";
      jQuery(".panel.panel-primary").closest(".row").append(tombol_singkron);
      jQuery("#hapus_rak_all").on("click", function () {
        hapus_rak();
      });
      jQuery("#singkron_rak_ke_lokal").on("click", function () {
        var type = "belanja";
        if (current_url.indexOf("siap/rak-pendapatan/list") != -1) {
          type = "pendapatan";
        } else if (jQuery('input[name="rek"]').val() == "penerimaan") {
          type = "pembiayaan-penerimaan";
        } else if (jQuery('input[name="rek"]').val() == "pengeluaran") {
          type = "pembiayaan-pengeluaran";
        }
        if (
          confirm(
            "Apakah anda yakin untuk melakukan singkronisasi RAK " +
              type +
              "? data di lokal akan diupdate!"
          )
        ) {
          jQuery("#wrap-loading").show();
          singkron_rak_ke_lokal({ type: type });
        }
      });
    });
  } else if (current_url.indexOf("/siap/skkdh") != -1) {
   /** var tombol_load =
      "" +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-success btn-1b" id="load_up_lokal"><i class="fa fa-cloud-upload m-r-5"></i> <span>Load UP Lokal</span></button></li>' +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-danger btn-outline btn-1b" id="save_up_lokal"><i class="fa fa-plus m-r-5"></i> <span>Save UP Lokal</span></button></li>' +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_pendahuluan">Singkron DB Lokal</button></li>';**/
    var tombol_load =
      "" +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-success btn-1b" id="singkron_up_lokal"><i class="fa fa-cloud-upload m-r-5"></i> <span>Singkron UP ke DB lokal</span></button></li>' +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_pendahuluan">Singkron DB Lokal</button></li>';
    jQuery("ul.breadcrumb").append(tombol_load);
    jQuery("#load_up_lokal").on("click", function () {
      load_up_lokal();
    });
    jQuery("#save_up_lokal").on("click", function () {
      save_up();
    });
    jQuery("#singkron_pendahuluan").on("click", function () {
      singkron_pendahuluan();
    });
    jQuery("#singkron_up_lokal").on("click",function(){
      singkron_up_lokal();
    })

    setTimeout(function () {
      var tombol_load2 =
        "" +
        '<a class="fcbtn btn btn-danger btn-outline btn-1b" id="load_up_lokal2" href="#"><i class="fa fa-cloud-upload m-r-5"></i> <span>Load UP Lokal</span></a>';
      jQuery("#btnSubmitSkkdh").after(tombol_load2);
      jQuery("#load_up_lokal2").on("click", function () {
        load_up_lokal(
          jQuery(".edit-skkdh form .form-group")
            .eq(0)
            .find(".ng-binding")
            .text()
        );
        return false;
      });
    }, 1000);
  } else if (current_url.indexOf("siap/rak-belanja/list") != -1) {
    var id_user = idUser();
    getUser(id_user).then(function (user) {
      var hapus_rak = "";
      if (user.idJabatan == 15) {
        hapus_rak =
          '<button style="margin-left: 10px;" class="btn btn-danger btn-1b pull-right" id="hapus_rak_all"><i class="fa fa-trash m-r-5"></i> <span>Hapus RAK Minus</span></button>';
      }
      var tombol_singkron =
        "" +
        hapus_rak +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b pull-right" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>';
      jQuery(".col-md-10.pl-0").append(tombol_singkron);
      jQuery("#singkron_rak_ke_lokal").on("click", function () {
        if (
          confirm(
            "Apakah anda yakin untuk melakukan singkronisasi RAK? data di lokal akan diupdate!"
          )
        ) {
          singkron_rak_ke_lokal_all();
        }
      });
      jQuery("#hapus_rak_all").on("click", function () {
        if (
          confirm(
            "Apakah anda yakin untuk menghapus RAK yang minus di SIPD penatausahaan?"
          )
        ) {
          hapus_rak_all();
        }
      });
    });
  } else if (current_url.indexOf("siap/rak-belanja") != -1) {
    var id_user = idUser();
    getUser(id_user).then(function (user) {
      var hapus_rak = "";
      if (user.idJabatan == 15) {
        hapus_rak =
          '<button style="margin-left: 10px;" class="btn btn-danger btn-1b pull-right" id="hapus_rak_all"><i class="fa fa-trash m-r-5"></i> <span>Hapus RAK Minus</span></button>';
      }
      var tombol_singkron =
        "" +
        hapus_rak +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b pull-right" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>';
      jQuery("h4.mt-0").parent().append(tombol_singkron);
      jQuery("#singkron_rak_ke_lokal").on("click", function () {
        if (
          confirm(
            "Apakah anda yakin untuk melakukan singkronisasi RAK? data di lokal akan diupdate!"
          )
        ) {
          singkron_rak_ke_lokal_all_pemda();
        }
      });
      jQuery("#hapus_rak_all").on("click", function () {
        if (
          confirm(
            "Apakah anda yakin untuk menghapus RAK yang minus di SIPD penatausahaan?"
          )
        ) {
          hapus_rak_all_pemda();
        }
      });
    });
  } else if (current_url.indexOf("siap/rak-pendapatan") != -1) {
    var id_user = idUser();
    getUser(id_user).then(function (user) {
      var tombol_singkron =
        "" +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b pull-right" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>';
      jQuery("h4.mt-0").parent().append(tombol_singkron);
      jQuery("#singkron_rak_ke_lokal").on("click", function () {
        if (
          confirm(
            "Apakah anda yakin untuk melakukan singkronisasi RAK Pendapatan? data di lokal akan diupdate!"
          )
        ) {
          singkron_rak_pendapatan_ke_lokal_all_pemda();
        }
      });
    });
  } else if (current_url.indexOf("siap/rak-pembiayaan/unit/") != -1) {
    var id_user = idUser();
    getUser(id_user).then(function (user) {
      var tombol_singkron =
        "" +
        '<button class="fcbtn btn btn-danger btn-outline btn-1b pull-right" id="singkron_rak_ke_lokal"><i class="fa fa-cloud-download m-r-5"></i> <span>Singkron RAK ke DB lokal</span></button>';
      jQuery("h4.mt-0").parent().append(tombol_singkron);
      jQuery("#singkron_rak_ke_lokal").on("click", function () {
        var type = "pembiayaan-penerimaan";
        if (current_url.indexOf("siap/rak-pembiayaan/unit/pengeluaran") != -1) {
          type = "pembiayaan-pengeluaran";
        }
        if (
          confirm(
            "Apakah anda yakin untuk melakukan singkronisasi RAK " +
              type +
              "? data di lokal akan diupdate!"
          )
        ) {
          singkron_rak_pembiayaan_ke_lokal_all_pemda(type);
        }
      });
    });
  } else if (
    current_url.indexOf("siap/dpa-bl-rinci/cetak") != -1 ||
    current_url.indexOf("siap/dpa-biaya/cetak") != -1 ||
    current_url.indexOf("siap/dpa-bl/cetak") != -1 ||
    current_url.indexOf("siap/dpa-penda/cetak") != -1 ||
    current_url.indexOf("siap/dpa-skpd/cetak") != -1
  ) {
    injectScript(chrome.extension.getURL("/js/jquery.min.js"), "html");

    if (config.print_magic) {
      jQuery('.cetak>table.tabel-standar[cellpadding="4"]').map(function (
        i,
        b
      ) {
        if (i % 2 != 0) {
          return;
        } else {
          jQuery(b).css("page-break-before", "always");
        }
      });
      var rak = jQuery('table[class="tabel-standar"]');
      rak.eq(rak.length - 3).css("page-break-before", "always");
    }

    if (config.tgl_dpa) {
      var tgl = get_tanggal();
      var tgl_dpa = jQuery("table.tabel-standar").eq(37).find("td").eq(0);
      tgl_dpa.text(tgl_dpa.text().replace(/\./g, "") + " " + tgl);
    }
    run_download_excel();
    var display = "display: none;";
    if (config.manual_indikator) {
      display = "";
    }
    var button_ind =
      "" +
      '<select id="pilih_skpd" style="min-width: 200px; margin: 0 5px 0 10px; height: 30px;"><option value="">Ganti ID SKPD</option></select><br><br>' +
      '<label><input type="radio" id="load_ind"> Munculkan indikator dari RKA DB Lokal</label>' +
      '<label style="' +
      display +
      '"><input type="radio" id="edit_ind"> Edit (Indikator, Anggaran Kas & Tgl TTD)</label>' +
      '<label><input type="radio" id="rm_draft"> Hapus Draft & input TTD PPKD</label>' +
      '<label><input type="radio" id="load_kas"> Munculkan Anggaran Kas DB Lokal</label>';
    jQuery("#action-sipd").append(button_ind);
    get_id_skpd_laporan(current_url).then(function (skpd) {
      id_skpd = skpd.id_skpd;
      jQuery("#wrap-loading").show();
      var data_ind = {
        action: "get_all_sub_unit",
        tahun_anggaran: config.tahun_anggaran,
        api_key: config.api_key,
        id_skpd: id_skpd,
      };
      var data_back = {
        message: {
          type: "get-url",
          content: {
            url: config.url_server_lokal,
            type: "post",
            data: data_ind,
            return: true,
          },
        },
      };
      chrome.runtime.sendMessage(data_back, function (response) {
        console.log("responeMessage", response);
      });
      jQuery("#rm_draft").on("click", function () {
        tambahTTDppkd();
      });
      jQuery("#load_kas").on("click", function () {
        if (
          confirm(
            "Data Anggaran Kas akan diupdate sesuai dengan data di database lokal!"
          )
        ) {
          var no_eq = 0;
          var cek_no_dpa = jQuery("table.tabel-standar")
            .eq(2)
            .find(">tbody>tr>td")
            .eq(0)
            .text()
            .trim();
          if (cek_no_dpa == "Nomor DPA") {
            no_eq = 1;
          }
          var kode_giat = get_kode_giat_laporan(no_eq);
          var kode_skpd = get_kode_skpd_laporan(no_eq);
          jQuery("#wrap-loading").show();
          var data_ind = {
            action: "get_kas",
            tahun_anggaran: config.tahun_anggaran,
            api_key: config.api_key,
            kode_giat: kode_giat,
            kode_skpd: kode_skpd,
          };
          var data_back = {
            message: {
              type: "get-url",
              content: {
                url: config.url_server_lokal,
                type: "post",
                data: data_ind,
                return: true,
              },
            },
          };
          chrome.runtime.sendMessage(data_back, function (response) {
            console.log("responeMessage", response);
          });
          console.log("kode_giat", kode_giat);
        } else {
          jQuery("#load_kas").prop("checked", false);
        }
      });
      jQuery("#pilih_skpd").on("change", function () {
        var val = jQuery(this).val();
        if (val != "") {
          window.location.href = current_url.replace(
            "/" + id_skpd + "?",
            "/" + val + "?"
          );
        }
      });
      jQuery("#edit_ind").on("click", function () {
        alert(
          "Silahkan klik pada kolom indikator yang masih kosong untuk melakukan edit!"
        );
        var type_dpa = jQuery("td.kiri.atas.kanan.bawah.text_tengah")
          .eq(1)
          .text();
        var w_rka = jQuery('table[class="tabel-standar"]#rka');
        if (type_dpa.indexOf("PA-RINCIAN BELANJASKPD") != -1) {
          var no_eq = 0;
          var cek_no_dpa = jQuery("table.tabel-standar")
            .eq(2)
            .find(">tbody>tr>td")
            .eq(0)
            .text()
            .trim();
          if (cek_no_dpa == "Nomor DPA") {
            no_eq = 1;
          }

          var cek_tahapan = "murni";
          if (
            jQuery("table.tabel-standar")
              .eq(1)
              .find("td")
              .eq(1)
              .text()
              .indexOf("DPPA") != -1
          ) {
            cek_tahapan = "pergeseran";
          }

          var sasaran_program = jQuery('table.tabel-standar[cellpadding="4"]')
            .eq(4 + no_eq)
            .find("td")
            .eq(2);
          sasaran_program.attr("contenteditable", true);

          var ind_prog = jQuery("table.tabel-standar")
            .eq(7 + no_eq)
            .find(">tbody");
          ind_prog.attr("contenteditable", true);

          var capaian_kegiatan = jQuery("table.tabel-standar")
            .eq(15 + no_eq)
            .find(">tbody");
          capaian_kegiatan.attr("contenteditable", true);

          var target_capaian_kegiatan = jQuery("table.tabel-standar")
            .eq(16 + no_eq)
            .find(">tbody");
          target_capaian_kegiatan.attr("contenteditable", true);

          var keluaran_kegiatan = jQuery("table.tabel-standar")
            .eq(19 + no_eq)
            .find(">tbody");
          keluaran_kegiatan.attr("contenteditable", true);

          var target_keluaran_kegiatan = jQuery("table.tabel-standar")
            .eq(20 + no_eq)
            .find(">tbody");
          target_keluaran_kegiatan.attr("contenteditable", true);

          var hasil_kegiatan = jQuery("table.tabel-standar").eq(21 + no_eq);
          if (hasil_kegiatan.find("tr").length == 0) {
            hasil_kegiatan.append('<tr><td contenteditable="true"></td></tr>');
          } else {
            hasil_kegiatan.find("tr>td").attr("contenteditable", true);
          }

          var target_hasil_kegiatan = jQuery("table.tabel-standar").eq(
            22 + no_eq
          );
          if (target_hasil_kegiatan.find("tr").length == 0) {
            target_hasil_kegiatan.append(
              '<tr><td contenteditable="true"></td></tr>'
            );
          } else {
            target_hasil_kegiatan.find("tr>td").attr("contenteditable", true);
          }

          if (cek_tahapan == "pergeseran") {
            var capaian_kegiatan_p = jQuery("table.tabel-standar")
              .eq(17 + no_eq)
              .find(">tbody");
            capaian_kegiatan_p.attr("contenteditable", true);

            var t_capaian_kegiatan_p = jQuery("table.tabel-standar")
              .eq(18 + no_eq)
              .find(">tbody");
            t_capaian_kegiatan_p.attr("contenteditable", true);

            var keluaran_kegiatan = jQuery("table.tabel-standar")
              .eq(23 + no_eq)
              .find(">tbody");
            keluaran_kegiatan.attr("contenteditable", true);

            var t_keluaran_kegiatan = jQuery("table.tabel-standar")
              .eq(24 + no_eq)
              .find(">tbody");
            t_keluaran_kegiatan.attr("contenteditable", true);

            var keluaran_kegiatan_p = jQuery("table.tabel-standar")
              .eq(25 + no_eq)
              .find(">tbody");
            keluaran_kegiatan_p.attr("contenteditable", true);

            var t_keluaran_kegiatan_p = jQuery("table.tabel-standar")
              .eq(26 + no_eq)
              .find(">tbody");
            t_keluaran_kegiatan_p.attr("contenteditable", true);

            var hasil_kegiatan = jQuery("table.tabel-standar").eq(27 + no_eq);
            if (hasil_kegiatan.find("tr").length == 0) {
              hasil_kegiatan.append(
                '<tbody contenteditable="true"><tr><td style=" mso-number-format:@;"></td></tr></tbody>'
              );
            } else {
              hasil_kegiatan.find(">tbody").attr("contenteditable", true);
            }

            var t_hasil_kegiatan = jQuery("table.tabel-standar").eq(28 + no_eq);
            if (t_hasil_kegiatan.find("tr").length == 0) {
              t_hasil_kegiatan.append(
                '<tbody contenteditable="true"><tr><td style=" mso-number-format:@;"></td></tr></tbody>'
              );
            } else {
              t_hasil_kegiatan.find(">tbody").attr("contenteditable", true);
            }

            var hasil_kegiatan_p = jQuery("table.tabel-standar").eq(29 + no_eq);
            if (hasil_kegiatan_p.find("tr").length == 0) {
              hasil_kegiatan_p.append(
                '<tbody contenteditable="true"><tr><td style=" mso-number-format:@;"></td></tr></tbody>'
              );
            } else {
              hasil_kegiatan_p.find(">tbody").attr("contenteditable", true);
            }

            var t_hasil_kegiatan_p = jQuery("table.tabel-standar").eq(
              30 + no_eq
            );
            if (t_hasil_kegiatan_p.find("tr").length == 0) {
              t_hasil_kegiatan_p.append(
                '<tbody contenteditable="true"><tr><td style=" mso-number-format:@;"></td></tr></tbody>'
              );
            } else {
              t_hasil_kegiatan_p.find(">tbody").attr("contenteditable", true);
            }
          }

          var kelompok_sasaran = jQuery("#rka>tbody>tr")
            .eq(15 + no_eq)
            .find("td");
          kelompok_sasaran.attr("contenteditable", true);

          if (config.manual_indikator_sub_keg) {
            jQuery('.cetak>table.tabel-standar[cellpadding="4"]').map(function (
              i,
              b
            ) {
              if (i % 2 != 0) {
                return;
              }
              if (cek_tahapan == "pergeseran") {
                var eq_1 = 4;
                if (i == 0) {
                  eq_1 = 3;
                }
              } else {
                var eq_1 = 5;
                if (i == 0) {
                  eq_1 = 4;
                }
              }
              jQuery(b)
                .find(">tbody>tr")
                .eq(eq_1)
                .find(".tabel-standar")
                .eq(1)
                .find(">tbody")
                .attr("contenteditable", true);
            });
          }
        }

        if (type_dpa.indexOf("PA-RINCIAN BELANJASKPD") != -1) {
          var rak = jQuery('table[class="tabel-standar"]');
          rak
            .eq(rak.length - 3)
            .find(">tbody")
            .attr("contenteditable", true);
        } else {
          w_rka.map(function (i, table) {
            var rak = jQuery(table).find('table[class="tabel-standar"]');
            rak
              .eq(rak.length - 3)
              .find(">tbody")
              .attr("contenteditable", true);
          });
        }
        // rak.eq(rak.length-2).find('>tbody').attr('contenteditable', true);
      });
      jQuery("#load_ind").on("click", function () {
        var no_eq = 0;
        var cek_no_dpa = jQuery("table.tabel-standar")
          .eq(2)
          .find(">tbody>tr>td")
          .eq(0)
          .text()
          .trim();
        if (cek_no_dpa == "Nomor DPA") {
          no_eq = 1;
        }
        var kode_giat = get_kode_giat_laporan(no_eq);
        var kode_skpd = get_kode_skpd_laporan(no_eq);
        jQuery("#wrap-loading").show();
        var data_ind = {
          action: "get_indikator",
          tahun_anggaran: config.tahun_anggaran,
          api_key: config.api_key,
          kode_giat: kode_giat,
          kode_skpd: kode_skpd,
        };
        var data_back = {
          message: {
            type: "get-url",
            content: {
              url: config.url_server_lokal,
              type: "post",
              data: data_ind,
              return: true,
            },
          },
        };
        chrome.runtime.sendMessage(data_back, function (response) {
          console.log("responeMessage", response);
        });
        console.log("kode_giat", kode_giat);
      });
    });
  } else if (current_url.indexOf("/user/ubah-profil") != -1) {
    var tombol_load =
      "" +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_user">Singkron DB Lokal</button></li>';
    jQuery("ul.breadcrumb").append(tombol_load);
    jQuery("#singkron_user").on("click", function () {
      singkronCurentUser();
    });
  } else if (current_url.indexOf("/siap/kelola-user") != -1) {
    var tombol_load =
      "" +
      '<li class="pull-right" style="padding: 2px 10px;"><button class="fcbtn btn btn-danger btn-outline btn-1b" id="singkron_user">Singkron DB Lokal</button></li>';
    jQuery("ul.breadcrumb").append(tombol_load);
    jQuery("#singkron_user").on("click", function () {
      singkronUser();
    });
    getUser(idUser()).then(function (skpd) {
      if (skpd == "") {
        getAllUnit(idSkpd()).then(function (all_unit) {
          console.log("all_unit", all_unit);
        });
        var simpan =
          '<button class="btn input-xl m-t-md btn-danger" id="btnSubmitCE" onclick="return false;"><i class="fa fa-plus m-r-xs "></i>Simpan by Chrome Extension</button>';
        jQuery("#btnLoad").after(simpan);
        jQuery("#btnSubmitCE").on("click", function () {
          getAllUnit(idSkpd()).then(function (skpd) {
            getJabatan().then(function (jab) {
              var nip = jQuery(
                'app-input-text[ng-model="formTambah.nip"] input'
              ).val();
              if (!nip) {
                return alert("nip tidak boleh kosong!");
              } else if (nip.length != 18) {
                return alert("NIP harus 18 karakter!");
              }
              var fullName = jQuery(
                'app-input-text[ng-model="formTambah.fullName"] input'
              ).val();
              if (!fullName) {
                return alert("nip tidak boleh kosong!");
              }
              var nomorHp = jQuery(
                'app-input-text[ng-model="formTambah.nomorHp"] input'
              ).val();
              if (!nomorHp) {
                return alert("Nomor HP tidak boleh kosong!");
              }
              var rank = jQuery(
                'app-input-text[ng-model="formTambah.rank"] input'
              ).val();
              if (!rank) {
                return alert("Pangkat tidak boleh kosong!");
              }
              var group = jQuery(
                'app-input-text[ng-model="formTambah.group"] input'
              ).val();
              if (!group) {
                return alert("Golongan tidak boleh kosong!");
              }
              var npwp = jQuery(
                'app-input-text[ng-model="formTambah.npwp"] input'
              ).val();
              if (!npwp) {
                return alert("NPWP tidak boleh kosong!");
              } else if (npwp.length != 15) {
                return alert("NPWP harus 15 karakter!");
              }
              var jabatan = jQuery(
                'searchable-dropdown[ng-model="formTambah.jabatan"] input'
              ).val();
              if (!jabatan) {
                return alert("Jabatan tidak boleh kosong!");
              }
              var userName = jQuery(
                'app-input-text[ng-model="formTambah.userName"] input'
              ).val();
              if (!userName) {
                return alert("Username tidak boleh kosong!");
              }
              var password = jQuery(
                'app-input-text[ng-model="formTambah.password"] input'
              ).val();
              if (!password) {
                return alert("Password tidak boleh kosong!");
              }
              var konfirmasiPassword = jQuery(
                'app-input-text[ng-model="formTambah.konfirmasiPassword"] input'
              ).val();
              if (!konfirmasiPassword) {
                return alert("Konfirmasi password tidak boleh kosong!");
              }
              var c_jabatan = false;
              jab.map(function (b, i) {
                if (b.namaJabatan == jabatan) {
                  c_jabatan = b;
                }
              });
              if (!c_jabatan) {
                return alert("Data jabatan kosong! Hubungi superman :)");
              }
              var data_user = [
                {
                  skpd: {
                    idSkpd: skpd.id_skpd,
                    namaSkpd: skpd.nama_skpd,
                    kodeSkpd: skpd.kode_skpd,
                    idDaerah: config.id_daerah,
                  },
                  userName: userName,
                  nip: nip,
                  fullName: fullName,
                  nomorHp: nomorHp,
                  rank: rank,
                  npwp: npwp,
                  jabatan: {
                    idJabatan: c_jabatan.idJabatan,
                    namaJabatan: c_jabatan.namaJabatan,
                    idRole: c_jabatan.idRole,
                    order: c_jabatan.order,
                    label: c_jabatan.namaJabatan,
                    value: c_jabatan.idJabatan,
                  },
                  kpa: null,
                  bank: null,
                  group: group,
                  password: password,
                  konfirmasiPassword: konfirmasiPassword,
                },
              ];
              console.log("data_user", data_user);
              tambahUser(data_user);
            });
          });
        });
      }
    });
  }

  jQuery("body").on("click", "#table_giat .btn-circle .fa-print", function () {
    var data = jQuery(this).attr("onclick").split('"');
    var options = {
      id_skpd: data[1],
      kode_bl: data[3],
      tahun_anggaran: config.tahun_anggaran,
    };
    setLampiran(options);
  });
});
