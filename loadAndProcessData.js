export const loadAndProcessData = () =>
    Promise.all([
        d3.csv('aoi_order_color.csv'),
        d3.csv('alpAll.csv'),
    ]).then (loadedData => {

        loadedData[1].forEach(d => {
            //0: "p_name"
            //1: "AOI"
            d.dwell_duration = +d.dwell_duration;
            d.conformity_score = +d.conformity_score;
            d.revisiting_score = +d.revisiting_score;
            d.seq_bar_length = +d.seq_bar_length;
            d.re_reading_bar_length = +d.re_reading_bar_length;
            d.trial = +d.trial;
            d.dwell_duration_log = +d.dwell_duration_log;
            d.bar_position = +d.bar_position;
            //10: "dwell_lt_100ms"
        });

        return loadedData;
    });