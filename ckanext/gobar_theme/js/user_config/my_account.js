$(function () {
    var showEditSection = function (e) {
        var replaceId = $(e.currentTarget).parents('.disabled-input').addClass('hidden').data('replace-id');
        $('#' + replaceId).removeClass('hidden');
    };
    $('.disabled-input svg').click(showEditSection);


    var resetEditSection = function (editSection) {
        var inputs = editSection.find('input');
        for (var i=0; i<inputs.length; i++) {
            var $input = $(inputs[i]);
            $input.val($input.data('default-value') || '');
        }
        editSection.addClass('hidden')
        return $('div[data-replace-id="' + editSection.attr('id') + '"]').removeClass('hidden');
    };
    $('#cancel-email, #cancel-password').click(function (e) {
        var editSection = $(e.currentTarget).parents('.edit-section');
        resetEditSection(editSection);
    });


    var sendChanges = function (editSection) {
        var inputs = editSection.find('input');
        var endpoint = editSection.data('endpoint');
        var data = {};
        var newData = $(inputs[0]).val();
        data[editSection.data('attr')] = newData;
        var callback = function (response) {
            console.log(response)
            if(response.success) {
                var defaultSection = resetEditSection(editSection);
                var input = defaultSection.find('input')
                input.val(newData)
                var attr = editSection.data('attr');
                if (attr == 'password') {
                    showPositiveFeedback(input, '¡Bien! Cambiaste la contraseña.')
                } else {
                    showPositiveFeedback(input, '¡Listo! Cambiaste el e-mail.')
                }
            }
        };
        $.post(endpoint, data, callback);
    };

    var validate = function (editSection) {
        var inputs = editSection.find('input');
        var firstInput = $(inputs[0]);
        var secondInput = $(inputs[1]);
        var valuesAreEqual = firstInput.val() == secondInput.val();

        clearFeedback(firstInput);
        clearFeedback(secondInput);

        if (firstInput.val().length == 0) {
            showNegativeFeedback(firstInput, 'Completá este dato.');
            return false
        }

        if (secondInput.val().length == 0) {
            showNegativeFeedback(secondInput, 'Completá este dato.');
            return false
        }

        var attr = editSection.data('attr');

        if (!valuesAreEqual) {
            if (attr == 'password') {
                showNegativeFeedback(secondInput, '¡Oh! Las contraseñas no coinciden. Probá otra vez.');
            } else {
                showNegativeFeedback(secondInput, '¡Oh! Los e-mails no coinciden. Probá otra vez.');
            }
            return false
        }

        if (attr == 'password' && secondInput.val().length < 4) {
            showNegativeFeedback(secondInput, 'Usá por lo menos 4 caracteres.');
            return false
        } else if (attr == 'email') {
            if (!email_re.test(secondInput.val())) {
                showNegativeFeedback(secondInput, 'Usá este formato nombre@ejemplo.com.');
                return false;
            }
        }
        return true
    };

    $('#save-email, #save-password').click(function (e) {
        var editSection = $(e.currentTarget).parents('.edit-section');
        var isValid = validate(editSection);
        if (isValid) {
            sendChanges(editSection)
        }
    });
});