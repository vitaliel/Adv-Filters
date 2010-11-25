var Filters = {
    // [{"name" : "field1", }, {...}]
    fields : [],

    // Operators enums
    // key = type, value => [[id1, value1], [id2, value2]]
    op_enums: {},

    // Field enums, key = enum name, value: select options array
    field_enums: {},
    group_idx : 1,
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
            $("#" + prefix + "_or_bt").remove();
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
        var value_c = $("#" + prefix + "_value_c");

        if (field["enum"]) {
          value_c.html('<select id="' + prefix +'_value" name="'+prefix+'[value]"></select>');
          var field_enum = [["", ""]].concat(this.field_enums[field["enum"]]);
          var field_select = $("#" + prefix + '_value')[0];
          $.each(field_enum, function(idx, el) { field_select.add(new Option(el[1], el[0]))});
        }
        else {
          value_c.html('<input type="text" id="' + prefix +'_value" name="'+prefix+'[value]">');
        }

        // Add OR button if delete link is not present
        if ($("#" + prefix + "_del").length == 0) {
            $("#" + prefix + "_or_c").html("<input type='button' id='" + prefix + "_or_bt' value='OR' />");
            $("#" + prefix + "_or_bt").click(function(evt){ Filters.add_or_line(evt.target.id) });
        }

        // Add AND button if it is last group and button does not exists
        var group_id = parseInt($("#" + prefix + "_group").val())

        if ($("#fgroup" + group_id + "_and").length == 0 && this.group_idx == group_id) {
            $("#filters").append("<div><input type='button' id='fgroup" + group_id + "_and' onclick='Filters.add_and_line(this.id);' value='AND' /></div>");
        }
    },

    el_prefix: function(el_id) {
        return el_id.substring(0, el_id.indexOf('_'));
    },

    generate_filter_line: function(group_id) {
        this.filter_idx += 1;
        var html = '<div id="filters' + this.filter_idx + '">';
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
        return html;
    },

    fill_filter_fields: function() {
        // add fields to select
        var field_select = $("#filters" + this.filter_idx + "_name")[0];
        field_select.add(new Option("",""));
        $.map(this.fields, function(el) {field_select.add(new Option(el["caption"], el["name"]))});
    },

    add_or_line: function(bt_or_id) {
        var prefix = this.el_prefix(bt_or_id);
        // get group id
        var group_id = $("#" + prefix + "_group")[0].value;

        $('#fgroup' + group_id).append(this.generate_filter_line(group_id));

        // replace OR with delete link
        $("#" + bt_or_id).remove();
        $("#" + prefix + "_or_c").html("<a class='delete' href='#' onclick='Filters.delete_filter(this.id); return false;' id='" + prefix + "_del'>X</a>");

        this.fill_filter_fields();
    },

    add_and_line: function(button_id) {
        // remove button
        $('#' +button_id).parent().html("AND");

        // add new group with new ID
        this.group_idx += 1;
        var html = "<div id='fgroup" + this.group_idx + "'>";
        html += this.generate_filter_line(this.group_idx);
        html += "</div>";
        $("#filters").append(html);
        this.fill_filter_fields();
    },

    delete_filter: function(link_id) {
        var prefix = this.el_prefix(link_id);
        $("#" + prefix).remove();
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
