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

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
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
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new MatrixPatternCanvas($content.find(".explanation")[0]);

            canvas.prepare(checkioInput[0], checkioInput[1]);


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

            var maxSizeX = 380;
            var cellSize = 40;
            var sizeX,
                sizeY;

            var paper;
            var cellSet;
            var numbSet;

            var attrRect0 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorBlue1};
            var attrRect1 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorBlue3};
            var attrRect2 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorOrange1};
            var attrRect3 = {"stroke": colorGrey4, "stroke-width": 2, "fill": colorOrange2};
            var attrNumb;

            this.prepare = function (pattern, matrix) {
                var pattern_lx = pattern[0].length;
                var pattern_ly = pattern.length;
                var matrix_lx = matrix[0].length;
                var matrix_ly = matrix.length;

                cellSize = Math.min(cellSize, maxSizeX / matrix_lx);
                sizeX = cellSize * matrix_lx;
                sizeY = cellSize * (matrix_ly + pattern_ly + 1);
                var px0 = (sizeX - cellSize * pattern_lx) / 2;
                var my0 = cellSize * (pattern_ly + 1);


                attrNumb = {"stroke": colorBlue4, "font-size": cellSize * 0.8, "font-family": "Verdana", "font-weight": "bold"};
                paper = Raphael(root, sizeX, sizeY);
                cellSet = paper.set();
                numbSet = paper.set();

                for (var i = 0; i < pattern_ly; i++) {
                    for (var j = 0; j < pattern_lx; j++) {
                        var cell = paper.set();
                        cell.push(
                            paper.rect(
                                px0 + j * cellSize,
                                i * cellSize,
                                cellSize, cellSize
                            ).attr(pattern[i][j] === 1 ? attrRect1 : attrRect0),
                            paper.text(
                                px0 + (j + 0.5) * cellSize,
                                (i + 0.5) * cellSize,
                                pattern[i][j]
                            ).attr(attrNumb)
                        );
                    }
                }
                for (i = 0; i < matrix_ly; i++) {
                    for (j = 0; j < matrix_lx; j++) {
                        cell = paper.set();
                        cell.push(
                            paper.rect(
                                j * cellSize,
                                my0 + i * cellSize,
                                cellSize, cellSize
                            ).attr(matrix[i][j] === 1 ? attrRect1 : attrRect0),
                            paper.text(
                                (j + 0.5) * cellSize,
                                my0 + (i + 0.5) * cellSize,
                                matrix[i][j]
                            ).attr(attrNumb)
                        );
                        cellSet.push(cell);
                    }
                }


            }
        }

    }
)
;
