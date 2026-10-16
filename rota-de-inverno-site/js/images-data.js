/* Fotos reais via Wikimedia Commons, priorizando inverno (viagem em dez/jan).
   Gerado a partir dos lotes winter_batch_*.json. */
const PLACE_IMAGES = {
    "lisboa":  {
                   "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Waiting_for_Santa_%2851797072511%29.jpg/1280px-Waiting_for_Santa_%2851797072511%29.jpg",
                   "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Waiting_for_Santa_(51797072511).jpg",
                   "author":  "Sergio",
                   "license":  "Public domain",
                   "caption":  "Giant illuminated Christmas tree in Praça do Comércio, Lisbon, during the winter holiday season"
               },
    "fatima_capelinha":  {
                             "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/20200204_Apparitions_6589_%2849657843946%29.jpg/1280px-20200204_Apparitions_6589_%2849657843946%29.jpg",
                             "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:20200204_Apparitions_6589_(49657843946).jpg",
                             "author":  "Ray Swi-hymn",
                             "license":  "CC BY-SA 2.0",
                             "caption":  "Pilgrims at the Capelinha das Aparições in Fátima in February, winter season"
                         },
    "fatima_basilica_rosario":  {
                                    "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Basilica_Fatima.jpg/1280px-Basilica_Fatima.jpg",
                                    "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Basilica_Fatima.jpg",
                                    "author":  "Andreas Trepte",
                                    "license":  "CC BY-SA 2.5",
                                    "caption":  "Basílica de Nossa Senhora do Rosário in Fátima, photographed in January winter"
                                },
    "fatima_basilica_trindade":  {
                                     "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Bas%C3%ADlica_da_Sant%C3%ADssima_Trindade_-_F%C3%A1tima_-_Portugal_%2810868270286%29.jpg/1280px-Bas%C3%ADlica_da_Sant%C3%ADssima_Trindade_-_F%C3%A1tima_-_Portugal_%2810868270286%29.jpg",
                                     "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Basílica_da_Santíssima_Trindade_-_Fátima_-_Portugal_(10868270286).jpg",
                                     "author":  "Vitor Oliveira",
                                     "license":  "CC BY-SA 2.0",
                                     "caption":  "Basílica da Santíssima Trindade in the Sanctuary of Fátima, photographed in December"
                                 },
    "porto_hero":  {
                       "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Porto_and_Douro_River_by_night_%2851707555230%29.jpg/1280px-Porto_and_Douro_River_by_night_%2851707555230%29.jpg",
                       "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Porto_and_Douro_River_by_night_(51707555230).jpg",
                       "author":  "Bex Walton",
                       "license":  "CC BY 2.0",
                       "caption":  "Porto and the Douro River illuminated at night in November"
                   },
    "porto_sao_bento":  {
                            "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Esta%C3%A7%C3%A3o_de_Porto-S%C3%A3o_Bento_%288227106469%29.jpg/1280px-Esta%C3%A7%C3%A3o_de_Porto-S%C3%A3o_Bento_%288227106469%29.jpg",
                            "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Estação_de_Porto-São_Bento_(8227106469).jpg",
                            "author":  "IngolfBLN",
                            "license":  "CC BY-SA 2.0",
                            "caption":  "São Bento railway station facade in Porto, photographed in November"
                        },
    "porto_se":  {
                     "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Porto_%2852734541165%29.jpg/1280px-Porto_%2852734541165%29.jpg",
                     "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Porto_(52734541165).jpg",
                     "author":  "Sergei Gussev",
                     "license":  "CC BY 2.0",
                     "caption":  "Sé do Porto, the cathedral of Porto, photographed in January winter"
                 },
    "porto_bolsa":  {
                        "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/20200131_PriceHenry_3541_%2849651034406%29.jpg/1280px-20200131_PriceHenry_3541_%2849651034406%29.jpg",
                        "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:20200131_PriceHenry_3541_(49651034406).jpg",
                        "author":  "Ray Swi-hymn",
                        "license":  "CC BY-SA 2.0",
                        "caption":  "Palácio da Bolsa, Porto\u0027s historic stock exchange palace, and the statue of Prince Henry the Navigator, in January winter"
                    },
    "porto_sao_francisco":  {
                                "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Porto_%2823355687670%29.jpg/1280px-Porto_%2823355687670%29.jpg",
                                "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Porto_(23355687670).jpg",
                                "author":  "michael kogan",
                                "license":  "CC BY-SA 2.0",
                                "caption":  "Igreja de São Francisco, Porto\u0027s Gothic church, photographed in November"
                            },
    "porto_gaia":  {
                       "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/20200131_DouroLouis1_5746_%2849651137736%29.jpg/1280px-20200131_DouroLouis1_5746_%2849651137736%29.jpg",
                       "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:20200131_DouroLouis1_5746_(49651137736).jpg",
                       "author":  "Ray Swi-hymn",
                       "license":  "CC BY-SA 2.0",
                       "caption":  "Dom Luís I Bridge and the port wine cellars of Vila Nova de Gaia across the Douro River, in January winter"
                   },
    "santiago_catedral":  {
                              "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Peregrino_facendo_foto%2C_Catedral_de_Santiago_de_Compostela%2C_fachada_e_praza_do_Obradoiro.jpg/1280px-Peregrino_facendo_foto%2C_Catedral_de_Santiago_de_Compostela%2C_fachada_e_praza_do_Obradoiro.jpg",
                              "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Peregrino_facendo_foto,_Catedral_de_Santiago_de_Compostela,_fachada_e_praza_do_Obradoiro.jpg",
                              "author":  "Wikimedia Commons",
                              "license":  "CC0",
                              "caption":  "Catedral de Santiago de Compostela and the Praza do Obradoiro, with a pilgrim photographing the facade"
                          },
    "santiago_mercado":  {
                             "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/2026._Mercado_de_Abastos._Santiago_de_Compostela._Galiza.jpg/1280px-2026._Mercado_de_Abastos._Santiago_de_Compostela._Galiza.jpg",
                             "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:2026._Mercado_de_Abastos._Santiago_de_Compostela._Galiza.jpg",
                             "author":  "Luis Miguel Bugallo Sánchez",
                             "license":  "CC BY-SA 4.0",
                             "caption":  "Building and clock tower of the Mercado de Abastos, the traditional food market of Santiago de Compostela"
                         },
    "viena_stephansdom":  {
                              "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Stephansdom_Winter_2011_-_panoramio.jpg/1280px-Stephansdom_Winter_2011_-_panoramio.jpg",
                              "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Stephansdom_Winter_2011_-_panoramio.jpg",
                              "author":  "nschuwi",
                              "license":  "CC BY 3.0",
                              "caption":  "Stephansdom in Vienna in winter, December 2011"
                          },
    "viena_graben":  {
                         "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/Graben_Weihnachtsbeleuchtung_5.jpg/1280px-Graben_Weihnachtsbeleuchtung_5.jpg",
                         "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Graben_Weihnachtsbeleuchtung_5.jpg",
                         "author":  "Geolina163",
                         "license":  "CC BY-SA 4.0",
                         "caption":  "The Graben pedestrian street in Vienna decorated with Christmas lights, December 2023"
                     },
    "viena_hofburg":  {
                          "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/The_Hofburg_Winter_Palace_in_Vienna%2C_Austria._%2816556035096%29.jpg/1280px-The_Hofburg_Winter_Palace_in_Vienna%2C_Austria._%2816556035096%29.jpg",
                          "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:The_Hofburg_Winter_Palace_in_Vienna,_Austria._(16556035096).jpg",
                          "author":  "traveljunction",
                          "license":  "CC BY-SA 2.0",
                          "caption":  "The Hofburg Palace in Vienna in winter, December 2014"
                      },
    "viena_biblioteca":  {
                             "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Allegory_of_war_and_Law_-_Prunksaal_-_Austrian_National_Library.jpg/1280px-Allegory_of_war_and_Law_-_Prunksaal_-_Austrian_National_Library.jpg",
                             "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Allegory_of_war_and_Law_-_Prunksaal_-_Austrian_National_Library.jpg",
                             "author":  "Daniel Gran",
                             "license":  "CC BY 2.5",
                             "caption":  "Baroque ceiling fresco of the Prunksaal, the State Hall of the Austrian National Library"
                         },
    "viena_rathausplatz":  {
                               "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/20231222.Christkindlmarkt_in_Wien%2C_Rathausplatz.-015.jpg/1280px-20231222.Christkindlmarkt_in_Wien%2C_Rathausplatz.-015.jpg",
                               "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:20231222.Christkindlmarkt_in_Wien,_Rathausplatz.-015.jpg",
                               "author":  "Bybbisch94",
                               "license":  "CC BY 4.0",
                               "caption":  "The Christkindlmarkt Christmas market at Rathausplatz in Vienna at night, illuminated with lights, December 2023"
                           },
    "viena_spittelberg":  {
                              "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Spittelberg_Weihnachtsmarkt_2023_01.jpg/1280px-Spittelberg_Weihnachtsmarkt_2023_01.jpg",
                              "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Spittelberg_Weihnachtsmarkt_2023_01.jpg",
                              "author":  "Geolina163",
                              "license":  "CC BY-SA 4.0",
                              "caption":  "Festive stalls and lights at the Spittelberg Christmas market (Weihnachtsmarkt) in Vienna, December 2023"
                          },
    "schonbrunn_palacio":  {
                               "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/1130_Schloss_Sch%C3%B6nbrunn_im_Schnee_IMG_1807.jpg/1280px-1130_Schloss_Sch%C3%B6nbrunn_im_Schnee_IMG_1807.jpg",
                               "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:1130_Schloss_Schönbrunn_im_Schnee_IMG_1807.jpg",
                               "author":  "Ewald Judt",
                               "license":  "CC BY 4.0",
                               "caption":  "Schönbrunn Palace covered in snow, viewed from the Great Parterre, in winter"
                           },
    "schonbrunn_gloriette":  {
                                 "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Gloriette_Vienna_Winter_2005.JPG/1280px-Gloriette_Vienna_Winter_2005.JPG",
                                 "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Gloriette_Vienna_Winter_2005.JPG",
                                 "author":  "Biho",
                                 "license":  "Copyrighted free use",
                                 "caption":  "The Gloriette overlooking the Schönbrunn gardens in winter, December 2005"
                             },
    "hallstatt":  {
                      "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Hallstatt_winter.jpg/1280px-Hallstatt_winter.jpg",
                      "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Hallstatt_winter.jpg",
                      "author":  "Thomas Fabian",
                      "license":  "CC BY-SA 2.0",
                      "caption":  "The lakeside village of Hallstatt on the Hallstätter See blanketed in snow, Austria"
                  },
    "salzburg_catedral":  {
                              "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Salzburg_-_Salzburger_Dom3.jpg/1280px-Salzburg_-_Salzburger_Dom3.jpg",
                              "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Salzburg_-_Salzburger_Dom3.jpg",
                              "author":  "Taxiarchos228",
                              "license":  "CC BY 3.0",
                              "caption":  "The main facade of Salzburg Cathedral (Salzburger Dom) in winter with snow and frost protection on the monument"
                          },
    "salzburg_mirabell":  {
                              "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Mirabellgarten_im_Winter_-_panoramio.jpg/1280px-Mirabellgarten_im_Winter_-_panoramio.jpg",
                              "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Mirabellgarten_im_Winter_-_panoramio.jpg",
                              "author":  "Bohao Zhao",
                              "license":  "CC BY 3.0",
                              "caption":  "Mirabell Gardens (Mirabellgarten) in winter, Salzburg, Austria"
                          },
    "salzburg_getreidegasse":  {
                                   "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/Austria_%288344887591%29.jpg/1280px-Austria_%288344887591%29.jpg",
                                   "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Austria_(8344887591).jpg",
                                   "author":  "Luca Nebuloni",
                                   "license":  "CC BY 2.0",
                                   "caption":  "Getreidegasse at night with Christmas decorations, Salzburg\u0027s historic shopping street known for its wrought-iron guild signs, December 2012"
                               },
    "estrasburgo_petite_france":  {
                                      "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Petite_France_Hiver.jpg/1280px-Petite_France_Hiver.jpg",
                                      "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Petite_France_Hiver.jpg",
                                      "author":  "Thomon",
                                      "license":  "CC BY-SA 4.0",
                                      "caption":  "Petite France, Strasbourg, seen from the Pont du Faisan in winter with frozen water"
                                  },
    "estrasburgo_catedral":  {
                                 "imageUrl":  "https://upload.wikimedia.org/wikipedia/commons/9/97/Cath%C3%A9drale_de_Strasbourg_sous_la_neige_-_btv1b102073698.jpg",
                                 "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Cathédrale_de_Strasbourg_sous_la_neige_-_btv1b102073698.jpg",
                                 "author":  "Dr. P. Wolff",
                                 "license":  "Public domain",
                                 "caption":  "Strasbourg Cathedral (Cathédrale Notre-Dame de Strasbourg) under snow, historic photograph"
                             },
    "paris_louvre":  {
                         "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Le_Louvre_sous_la_neige_D260105_1.jpg/1280px-Le_Louvre_sous_la_neige_D260105_1.jpg",
                         "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Le_Louvre_sous_la_neige_D260105_1.jpg",
                         "author":  "Tangopaso",
                         "license":  "Public domain",
                         "caption":  "The Louvre\u0027s Cour Napoléon and Pyramid under snow, Paris"
                     },
    "paris_tuileries":  {
                            "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Jardin_des_Tuileries_couvert_de_neige%2C_Paris%2C_janvier_2009.jpg/1280px-Jardin_des_Tuileries_couvert_de_neige%2C_Paris%2C_janvier_2009.jpg",
                            "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Jardin_des_Tuileries_couvert_de_neige,_Paris,_janvier_2009.jpg",
                            "author":  "Teknad",
                            "license":  "CC BY-SA 4.0",
                            "caption":  "The Tuileries Garden covered in snow, Paris, January 2009"
                        },
    "paris_opera":  {
                        "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Avenue_de_Opera_Paris_under_the_snow_2013-01-20.jpg/1280px-Avenue_de_Opera_Paris_under_the_snow_2013-01-20.jpg",
                        "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Avenue_de_Opera_Paris_under_the_snow_2013-01-20.jpg",
                        "author":  "Marie-Lan Nguyen",
                        "license":  "CC BY 2.5",
                        "caption":  "The Palais Garnier (Paris Opera House) seen from a snow-covered Avenue de l\u0027Opéra, January 2013"
                    },
    "paris_montmartre":  {
                             "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Montmartre_sous_la_neige_en_janvier_2026_-_Portrait.jpg/1280px-Montmartre_sous_la_neige_en_janvier_2026_-_Portrait.jpg",
                             "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Montmartre_sous_la_neige_en_janvier_2026_-_Portrait.jpg",
                             "author":  "Louis Barret",
                             "license":  "CC BY-SA 4.0",
                             "caption":  "View from the Sacré-Cœur Basilica over snow-covered Montmartre, Paris, January 2026"
                         },
    "paris_tertre":  {
                         "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Paris_Montmartre_Place_du_Tertre_evening_2026-01-03-1.jpg/1280px-Paris_Montmartre_Place_du_Tertre_evening_2026-01-03-1.jpg",
                         "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Paris_Montmartre_Place_du_Tertre_evening_2026-01-03-1.jpg",
                         "author":  "Renée Kools",
                         "license":  "CC BY 4.0",
                         "caption":  "Place du Tertre, Montmartre\u0027s artists\u0027 square, in the evening on January 3"
                     },
    "paris_moulin_rouge":  {
                               "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Paris%2C_Moulin_Rouge_--_2014_--_1220.jpg/1280px-Paris%2C_Moulin_Rouge_--_2014_--_1220.jpg",
                               "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Paris,_Moulin_Rouge_--_2014_--_1220.jpg",
                               "author":  "Dietmar Rabich",
                               "license":  "CC BY-SA 4.0",
                               "caption":  "The red windmill and facade of the Moulin Rouge cabaret in Paris"
                           },
    "paris_notredame":  {
                            "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Cath%C3%A9drale_Notre-Dame_de_Paris_sous_la_neige_en_janvier_2026.jpg/1280px-Cath%C3%A9drale_Notre-Dame_de_Paris_sous_la_neige_en_janvier_2026.jpg",
                            "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Cathédrale_Notre-Dame_de_Paris_sous_la_neige_en_janvier_2026.jpg",
                            "author":  "Louis Barret",
                            "license":  "CC BY-SA 4.0",
                            "caption":  "Notre-Dame de Paris cathedral covered in snow in January 2026, after its 2024 reopening"
                        },
    "paris_saintechapelle":  {
                                 "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/PA00085991_-_Sainte_Chapelle_%28vitraux_et_chandelier%29.jpg/1280px-PA00085991_-_Sainte_Chapelle_%28vitraux_et_chandelier%29.jpg",
                                 "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:PA00085991_-_Sainte_Chapelle_(vitraux_et_chandelier).jpg",
                                 "author":  "Luiza Fediuc",
                                 "license":  "CC BY-SA 3.0",
                                 "caption":  "The stained-glass interior of Sainte-Chapelle, Paris, with its ornate chandelier"
                             },
    "paris_marais":  {
                         "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Plaza_de_los_Vosgos%2C_Par%C3%ADs%2C_Francia%2C_2022-10-30%2C_DD_58.jpg/1280px-Plaza_de_los_Vosgos%2C_Par%C3%ADs%2C_Francia%2C_2022-10-30%2C_DD_58.jpg",
                         "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Plaza_de_los_Vosgos,_París,_Francia,_2022-10-30,_DD_58.jpg",
                         "author":  "Diego Delso",
                         "license":  "CC BY-SA 4.0",
                         "caption":  "Place des Vosges, the historic arcaded square in the Marais district of Paris"
                     },
    "paris_eiffel":  {
                         "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Trocadero_in_the_snow_%288398588541%29.jpg/1280px-Trocadero_in_the_snow_%288398588541%29.jpg",
                         "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Trocadero_in_the_snow_(8398588541).jpg",
                         "author":  "Paris-Sharing",
                         "license":  "CC BY 2.0",
                         "caption":  "The Trocadéro esplanade and the Eiffel Tower covered in snow, January 2013"
                     },
    "paris_sena":  {
                       "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Paris_en_hiver%2C_quai_Malaquais%2C_2013.jpg/1280px-Paris_en_hiver%2C_quai_Malaquais%2C_2013.jpg",
                       "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Paris_en_hiver,_quai_Malaquais,_2013.jpg",
                       "author":  "Henry Marion",
                       "license":  "CC BY-SA 2.0",
                       "caption":  "The Seine along the Quai Malaquais in Paris in the evening, in winter"
                   },
    "versailles_palacio":  {
                               "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Le_ch%C3%A2teau_de_Versailles_sous_la_neige.jpg/1280px-Le_ch%C3%A2teau_de_Versailles_sous_la_neige.jpg",
                               "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Le_château_de_Versailles_sous_la_neige.jpg",
                               "author":  "MaitéLab",
                               "license":  "CC BY-SA 3.0",
                               "caption":  "The Palace of Versailles covered in snow, December 2009"
                           },
    "versailles_jardins":  {
                               "imageUrl":  "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1c/Toren_van_Marlborough_in_de_tuinen_van_het_Petit_Trianon%2C_onder_de_sneeuw_535_Jardins_du_Petit_Trianon._La_Tour_Malborough_sic%2C_effet_de_neige_%28titel_op_object%29%2C_RP-F-F16632.jpg/1280px-thumbnail.jpg",
                               "commonsPageUrl":  "https://commons.wikimedia.org/wiki/File:Toren_van_Marlborough_in_de_tuinen_van_het_Petit_Trianon,_onder_de_sneeuw_535_Jardins_du_Petit_Trianon._La_Tour_Malborough_sic,_effet_de_neige_(titel_op_object),_RP-F-F16632.jpg",
                               "author":  "Rijksmuseum",
                               "license":  "CC0",
                               "caption":  "The Marlborough Tower in the gardens of the Petit Trianon at Versailles under a snow effect, historic photograph (1870-1900)"
                           }
};
