//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            var strCheckioInput = JSON.stringify(checkioInput[0]) + "," + JSON.stringify(checkioInput[1]);

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + strCheckioInput + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + strCheckioInput + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + strCheckioInput + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new MatrixPatternCanvas($content.find(".explanation")[0]);

            canvas.prepare(checkioInput[0], checkioInput[1]);
            canvas.animate(explanation);


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//                e.stopPropagation();
//                return false;
//            });
//        });

        function MatrixPatternCanvas(root) {
            var format = Raphael.format;
            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var maxSizeX = 360;
            var cellSize = 40;
            var sizeX,
                sizeY;
            var px0,
                my0;

            var pad = 10;

            var pattern_lx,
                pattern_ly,
                matrix_lx,
                matrix_ly;

            var paper;
            var cellSet = [];
            var numbSet;

            var attrRect0 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorBlue1};
            var attrRect1 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorBlue2};
            var attrRect2 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorOrange1};
            var attrRect3 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorOrange3};
            var attrNumb;
            var attrFrame = {"stroke": colorBlue4, "stroke-width": 4};

            var moveTime = 300;

            this.prepare = function (pattern, matrix) {
                pattern_lx = pattern[0].length;
                pattern_ly = pattern.length;
                matrix_lx = matrix[0].length;
                matrix_ly = matrix.length;

                cellSize = Math.min(cellSize, maxSizeX / matrix_lx);
                sizeX = cellSize * matrix_lx + 2 * pad;
                sizeY = cellSize * (matrix_ly + pattern_ly + 1) + 2 * pad;
                px0 = (sizeX - cellSize * pattern_lx) / 2;
                my0 = cellSize * (pattern_ly + 1);


                attrNumb = {"stroke": colorBlue4, "font-size": cellSize * 0.8, "font-family": "Verdana", "font-weight": "bold"};
                paper = Raphael(root, sizeX, sizeY);
                numbSet = paper.set();

                for (var i = 0; i < pattern_ly; i++) {

                    for (var j = 0; j < pattern_lx; j++) {
                        var cell = paper.set();
                        cell.push(
                            paper.rect(
                                px0 + j * cellSize + pad,
                                i * cellSize + pad,
                                cellSize, cellSize
                            ).attr(pattern[i][j] === 1 ? attrRect1 : attrRect0),
                            paper.text(
                                px0 + (j + 0.5) * cellSize + pad,
                                (i + 0.5) * cellSize + pad,
                                pattern[i][j]
                            ).attr(attrNumb)
                        );
                    }
                }
                for (i = 0; i < matrix_ly; i++) {
                    var rowSet = [];
                    for (j = 0; j < matrix_lx; j++) {
                        cell = paper.set();
                        cell.push(
                            paper.rect(
                                j * cellSize + pad,
                                my0 + i * cellSize + pad,
                                cellSize, cellSize
                            ).attr(matrix[i][j] === 1 ? attrRect1 : attrRect0),
                            paper.text(
                                (j + 0.5) * cellSize + pad,
                                my0 + (i + 0.5) * cellSize + pad,
                                matrix[i][j]
                            ).attr(attrNumb)
                        );
                        cell.number = matrix[i][j];
                        rowSet.push(cell);
                    }
                    cellSet.push(rowSet);
                }
            };

            this.animate = function (marks) {
                var row = 0,
                    col = 0;

                var lastRow = matrix_ly - pattern_ly;
                var lastColumn = matrix_lx - pattern_lx + 1;

                var frame = paper.rect(pad, pad + my0,
                    cellSize * pattern_lx, cellSize * pattern_ly, cellSize / 20).attr(attrFrame);

                (function move() {
                    if (col >= lastColumn) {
                        if (row >= lastRow) {
                            return false;
                        }
                        else {
                            col = 0;
                            row++;
                            return move();
                        }
                    }

                    frame.animate({transform: format(
                            "t{0},{1}",
                            col * cellSize,
                            row * cellSize
                        )},
                        moveTime,
                        function () {
                            col++;
                            if (marks.indexOf(row * matrix_lx + col - 1) !== -1) {
                                frame.animate({"stroke": colorOrange4}, moveTime, function () {
                                    frame.animate({"stroke": colorBlue4}, moveTime, move)
                                });
                                for (var i = 0; i < pattern_ly; i++) {
                                    for (var j = 0; j < pattern_lx; j++) {
                                        var cell = cellSet[row + i][col + j - 1];
                                        cell.number += 2;
                                        if (cell.number === 2) {
                                            cell[0].animate(attrRect2, moveTime * 2);
                                            cell[1].attr("text", 2);
                                        }
                                        else {
                                            cell[0].animate(attrRect3, moveTime * 2);
                                            cell[1].attr("text", 3);
                                        }

                                    }
                                }
                            }
                            else {
                                move();
                            }
                        });


                }())
            }
        }

    }
)
;
