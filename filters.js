var Filters = {
    // [{"name" : "field1", }, {...}]
    fields : [],

    // key = type, value => [[id1, value1], [id2, value2]]
    op_enums: {},
    group_idx : 0,
    filter_idx: 1,

    get_field: function(field_name) {
        return $.grep(this.fields, function(el) { return el["name"] == field_name })[0]
    },

    get_field_type: function(field_name) {
        var field = this.get_field(field_name);

        if (field)
            return field["type"]
        else
            return null;
    },

    get_enum_op_for: function(field_name) {
        var type = this.get_field_type(field_name)

        if (type != null)
            return this.op_enums[type];
        else {
            alert("Can not find type for " + field_name)
        }
    },

    activate_filter_op: function(select) {
        var prefix = this.el_prefix(select.id);
        var id_op = "#" + prefix + "_op"
        var op_select = $(id_op)[0];

        // if nothing is selected disable op && value
        if (select.selectedIndex == 0) {
            op_select.disabled = true;
            $("#" + prefix + "_value")[0].disabled = true;
            $("#" + prefix + "_or_c").html("");
            return;
        }

        var field_name = select.value;

        // fill op && enable
        var op_enum = [["", ""]].concat(this.get_enum_op_for(field_name));
        $(id_op + " option").remove();
        $.each(op_enum, function(idx, el) { op_select.add(new Option(el[1], el[0]))});
        op_select.disabled = false;

        // fill value drop down if it is the case && enable
        var field = this.get_field(field_name);
        var html = '<input type="text" id="' + prefix +'_value" name="'+prefix+'[value]">'

        if (field["enum"]) {
            // TODO: get enum and fill it
        }

        $("#" + prefix + "_value_c").html(html);
        // Add OR button
        $("#" + prefix + "_or_c").html("<input type='button' id='" + prefix + "_or_bt' value='OR' />");
        $("#" + prefix + "_or_bt").click(function(evt){ Filters.add_or_line(evt.target.id) });
    },

    el_prefix: function(el_id) {
        return el_id.substring(0, el_id.indexOf('_'));
    },

    add_or_line: function(bt_or_id) {
        var prefix = this.el_prefix(bt_or_id);
        this.filter_idx += 1;
        // get group id
        var group_id = $("#" + prefix + "_group")[0].value;
        var html = '<div id="filter' + this.filter_idx + '">';
        // add field select
        html += "<select id='filters" + this.filter_idx + "_name' name='filters" + this.filter_idx + "[name]' onchange=\"Filters.activate_filter_op(this);\"></select>\n";
        // add group hidden field
        html += '<input type="hidden" id="filters'+this.filter_idx+'_group" name="filters'+this.filter_idx+'[group]" value="' + group_id + '" />';
        // add op select disabled
        html += "<select disabled=\"disabled\" id='filters" + this.filter_idx + "_op' name='filters" + this.filter_idx + "[op]'></select>\n";
        // add value input disabled
        html += '<span id="filters' + this.filter_idx +'_value_c">';
        html += '<input disabled="disabled" type="text" id="filters' + this.filter_idx + '_value" name="filters' + this.filter_idx + '[value]">';
        html += "</span>";
        html += '<span id="filters' + this.filter_idx + '_or_c"></span>';
        html += "</div>";
        $('#fgroup' + group_id).append(html);

        // TODO replace OR with delete link

        // add fields to select
        field_select = $("#filters" + this.filter_idx + "_name")[0];
        field_select.add(new Option("",""));
        $.map(this.fields, function(el) {field_select.add(new Option(el["caption"], el["name"]))});
    },

    render: function() {

    },

    init_filters: function () {
        $("#bt_selected_to_right").click(function() {
            if ($("#available_fields").val() == null) {
                //alert("You need to select a contact to move to the right hand side.");
            }
            else {
                $("#available_fields option:selected").remove().appendTo("#selected_fields");
            }
        });
        $("#bt_all_to_right").click(function() {
            if ($("#available_fields").length > 0) {
                $("#available_fields option").remove().appendTo("#selected_fields");
            }
        });
        $("#bt_selected_to_left").click(function() {
            if ($("#selected_fields").val() == null) {
                //alert("You need to select a contact to move to the right hand side.");
            }
            else {
                $("#selected_fields option:selected").remove().appendTo("#available_fields");
            }
        });
        $("#bt_all_to_left").click(function() {
            if ($("#selected_fields").length > 0) {
                $("#selected_fields option").remove().appendTo("#available_fields");
            }
        });
    }
};
