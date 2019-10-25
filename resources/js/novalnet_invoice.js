$(document).ready( function() {
    
    $("#nn_invoice_date").on("keypress keyup",function (e)
    {
        var exp = String.fromCharCode(e.which);
        var reg = new RegExp(/[^0-9]/g);
        if (exp.match(reg))
        {
          e.preventDefault();
        }
            var day_val = $('#nn_invoice_date').val();
            var len = day_val.length;  
        
            if ((len == 1 && ((exp > -1 && day_val.charAt(0) > 3))) || (len == 1 && ((exp == 0 && day_val.charAt(0) == 0))) || (len == 1 && ((exp > 1 && day_val.charAt(0) == 3)))) {
            return false;
            }
        
    });
    
    $('#nn_invoice_date').on('blur', function() {
    var date = $('#nn_invoice_date').val();
    if (date != '0' && date != '' && date.length < 2) {
        var result = "0"+ date; 
        $('#nn_invoice_date').val(result);
    }
    if (date == '0') {
        var changed_date = date.replace('0', '01');
        $('#nn_invoice_date').val(changed_date);
    }
    });
    
    var min_year_flag = false;
    var max_year_flag = false;
    document.getElementById("nn_invoice_year").addEventListener("keyup", function(e) {  
        var year_val = document.getElementById("nn_invoice_year").value;
        var year_len = year_val.length;
        if(year_len == 1 && year_val == 2) {
            max_year_flag = true;
            min_year_flag = false;
        }
        if(year_len == 1 && year_val == 1) {
            min_year_flag = true;
            max_year_flag = false;
        }
        });

    document.getElementById("nn_invoice_year").addEventListener("keypress", function(e) {
        var expval = String.fromCharCode(e.which);
        var year_val = document.getElementById("nn_invoice_year").value;
        var year_len = year_val.length;         
        var pos_max_val = max_year.toString().charAt(year_len); 
        var pos_min_val = min_year.toString().charAt(year_len); 

        var reg = new RegExp(/[^0-9]/g);
        if (expval.match(reg))
        {
        e.preventDefault();
        }

        if(max_year_flag == true && ((expval > pos_max_val) || (year_len == 3 && year_val+expval > max_year))) {
            e.preventDefault();
        } else if(min_year_flag == true && ((year_len == 3 && year_val+expval < min_year) || (year_len == 0 && expval > 2) || (expval != pos_min_val && expval < pos_min_val && year_len != 3 && year_len != 0))) {
            e.preventDefault();
        } else if(year_len == 0 && expval == 0) {
            e.preventDefault();
        }   
    });
    
    function yearAutocomplete(input_val, array_year) {
 
      var currentFocus;
  
      input_val.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
     
      closeAllLists();
      if (!val || val.length < 2) { return false;}
      currentFocus = -1;
      
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      
      this.parentNode.appendChild(a);
      var count = 1;
      for (i = 0; i < array_year.length; i++) {     
        var regex = new RegExp( val, 'g' );
        if (array_year[i].match(regex)) {   
      if( count == 10 ) {
       break;
      }
          b = document.createElement("DIV");
          b.innerHTML = array_year[i].replace( val,"<strong>" + val + "</strong>" );          
          b.innerHTML += "<input type='hidden' value='" + array_year[i] + "'>";
          b.addEventListener("click", function(e) {
              input_val.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
      count++;
        }
      }
  });
  
      input_val.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
          } else if (e.keyCode == 38) { 
            currentFocus--;
            addActive(x);
          } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != input_val) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
    }

      let current_date = new Date();
      current_date.getFullYear();
      var max_year = current_date.getFullYear() - 18;   
    
      var min_year = current_date.getFullYear() - 91;
      
    var year_range = [];
    
    for( var year = max_year; year >= min_year; year-- ) {              
        year_range.push('' + year + '');
    }

    yearAutocomplete(document.getElementById("nn_invoice_year"), year_range);
    
    
    $('#nn_invoice_form').on('submit', function() {
    $('#novalnet_form_btn').attr('disabled',true);
        if ( $("#nn_invoice_year").val() == '' || $("#nn_invoice_date").val() == '' ) {
        alert($("#nn_dob_empty").val());
        $('#novalnet_form_btn').attr('disabled',false);
        return false;
        }
        
        if($("#nn_invoice_month").val() == '0' ) {
        alert($("#nn_dob_month").val());
        $('#novalnet_form_btn').attr('disabled',false);
            return false;
        }
    
        return isActualDate($("#nn_invoice_month").val(), $("#nn_invoice_date").val(), $("#nn_invoice_year").val());
        });
    
        function isActualDate (month, day, year) {
            var tempDate = new Date(year, --month, day);
            if( month !== tempDate.getMonth() || $("#nn_invoice_year").val().length < 4) {
                alert($("#nn_dob_invalid").val());
                $('#novalnet_form_btn').attr('disabled',false);
                return false;
            }
            return true;
        }
    
});

 
