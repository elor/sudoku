$(function($) {
  var $rows, $cols, $groups, $fields;

  $rows = [];
  $cols = [];
  $groups = [];
  $fields = [];

  /**
   * @param fieldid
   * @return the row of the field
   */
  function getRow(fieldid) {
    return Math.floor(fieldid / 9);
  }

  /**
   * @param fieldid
   * @return the col of the field
   */
  function getCol(fieldid) {
    return fieldid % 9;
  }

  /**
   * @param fieldid
   * @return the group of the field
   */
  function getGroup(fieldid) {
    return Math.floor(getCol(fieldid) / 3) + Math.floor(getRow(fieldid) / 3)
        * 3;
  }

  /**
   * create the sudoku field and map all fields
   */
  function createFields() {
    var $form, i, $template, $field;

    $form = $('<form>');

    $template = $('<input>');
    $template.attr('type', 'number');
    $template.attr('min', 1);
    $template.attr('max', 9);
    $template.val('');

    for (i = 0; i < 9; i += 1) {
      $rows[i] = [];
      $cols[i] = [];
      $groups[i] = [];
    }

    for (i = 0; i < 9 * 9; i += 1) {
      $field = $template.clone();
      $field.data('id', i);

      $rows[getRow(i)].push($field);
      $cols[getCol(i)].push($field);
      $groups[getGroup(i)].push($field);
      $fields[i] = $field;

      $form.append($field);
      // if (getCol(i) === 8) {
      // $form.append($('<br>'));
      // }
    }

    $form.append($('<input>').attr('type', 'submit').val('Sudoku lösen'));
    $form.append($('<input>').attr('type', 'button').val('reset').click(
        function(e) {
          resetSudoku();
          e.preventDefault();
          return false;
        }));

    $form.on('submit', function(e) {
      window.setTimeout(solveSudoku, 1);
      e.preventDefault();
      return false;
    });
    $('body').append($form);
  }

  /**
   * solve the sudoku
   */
  function solveSudoku() {
    $fields.forEach(function($field) {
      if ($field.val() !== '') {
        $field.prop('disabled', true);
      }
    });

    traverseTree();

    if (isComplete()) {
      $('form').append($('<div>').text('Fertig.'));
    } else {
      $('form').append($('<div>').text('keine vollständige Lösung.'));
    }
  }

  function traverseTree(index) {
    var value, $field;

    index = index || 0;

    if (index === $fields.length) {
      return true;
    }

    $field = $fields[index];

    if ($field.prop('disabled')) {
      return traverseTree(index + 1);
    }

    for (value = 1; value <= 9; value += 1) {

      $field.val(value);
      if (validate(index)) {
        if (traverseTree(index + 1)) {
          return true;
        }
      }
    }

    $field.val('');
    return false;
  }

  /**
   * @param fieldid
   *          Optional. The id of the recently changed field
   * @return true if the current sub-solution is valid, false otherwise
   */
  function validate(fieldid) {
    if (fieldid === undefined) {
      return $rows.every(isValidComponent) && $cols.every(isValidComponent)
          && $groups.every(isValidComponent);
    }

    return isValidComponent($rows[getRow(fieldid)])
        && isValidComponent($cols[getCol(fieldid)])
        && isValidComponent($groups[getGroup(fieldid)]);
  }

  /**
   * @param $fieldset
   *          a set if jQuery object representing a group of input fields
   * @return true if the fieldset is valid, false otherwise
   */
  function isValidComponent($fieldset) {
    return $fieldset.every(function($field, index) {
      var val, i;

      val = $field.val();

      if (val !== '') {
        for (i = index + 1; i < $fieldset.length; i += 1) {
          if (val === $fieldset[i].val()) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * @return true if the sudoku has been completed, false otherwise
   */
  function isComplete() {
    return $fields.every(function($field) {
      return $field.val() !== '';
    });
  }

  /**
   * reset all fields
   */
  function resetSudoku() {
    $('form').remove();
    createFields();
  }

  createFields();
});
