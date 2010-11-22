var Filters = {
    // [{"name" : "field1", }, {...}]
    fields : [],

    // key = type, value => [[id1, value1], [id2, value2]]
    op_enums: {},

    get_field: function(field_name) {
        $.grep(this.fields, function(el) { return el["name"] == field_name })[0]
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

        if (type)
            return op_enums[type];
        else {
            alert("Can not find type for " + field_name)
        }
    },

    activate_filter_op: function(select) {
        var idx = select.id.indexOf('_');

        var prefix = select.id.substring(0, idx)
        var field_name = select.id.substring(idx + 1);

        // TODO if nothing is selected disable op && value

        // fill op && enable
        var op_enum = [["", ""]] + this.get_enum_op_for(field_name);
        var id_op = "#" + prefix + "_op"
        var op_select = $(id_op + " option").remove();

        $.each(op_enum,  function(el) { $(id_op).add(new Option(el[0], el[1]))});
        $(id_op).disabled = false;

        // fill value drop down if it is the case && enable
        var field = this.get_field(field_name);
        var html = '<input type="text" id="' + prefix +'_value" name="'+prefix+'[value]">'

        if (field["enum"]) {
            // TODO: get enum and fill it
        }

        $("#" + prefix + "_value_c").html(html);
        // TODO add OR button
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
