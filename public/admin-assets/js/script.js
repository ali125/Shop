$(document).ready(function() {
    $('.js-select2-multiple').select2();
    $('.js-select2-single').select2();

    function formatColor(el, ie) {
        const colors = $(el.element).attr('data-colors');
        let $colors = '<span class="setting-colors-option">';
        if(colors) {
            $colors += '<span class="setting-color-show">';
            colors.split(',').forEach(color => {
                $colors += '<span style="background-color: ' + color.trim() + '"></span>';
            });
            $colors += '</span>';
        }``
        $colors += el.text + '</span>';
        return $($colors);
    }
    $('.js-select2-pmeta').select2({
        templateResult: formatColor
    });

    $('#summernote').summernote({
        lang: 'fa-IR',
        height: 100,
        tabsize: 2,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['codeview', 'help']]
        ]
    });

    $("#dropzone").dropzone({
        url: "/api/admin/media/add",
        paramName: "file",
        maxFilesize: 2,
        method: "post",
        success: function(file, response) {
            console.log($(this).data('id'), $(this), $(this).attr('data-id'));
            // $('#media_upload').append()
            // $('.main-form .media').append(`<input type="hidden" name="media_id[]" value="${response.media.id}" />`);
            // Ask the question, and call accepted() or rejected() accordingly.
            // CAREFUL: rejected might not be defined. Do nothing in that case.
        }
    });

    function progressHandling(e) {
        console.log('progressHandling', e)
    }
    function uploadFile(
        {
            method = "POST",
            name = "file",
            url = "/api/admin/media/add",
            file,
            success,
            error
        }
    ) {
        const csrfToken = $('meta[name="csrf-token"]').attr('content')

        const formData = new FormData();
        formData.append(name, file, file.name);
        $.ajax({
            credentials: 'same-origin', // <-- includes cookies in the request
            headers: {
                'CSRF-Token': csrfToken // <-- is the csrf token as a header
            },
            type: method,
            url,
            xhr: function () {
                const myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', progressHandling, false);
                }
                return myXhr;
            },
            success,
            error,
            async: true,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        })
    }
    $('body').on('change', '.file-uploader input[type="file"]', (e) => {
        const inputFile = e.target;
        const name = $(inputFile).parent().parent().data('id');
        let imageList = $(inputFile).parent().parent().find('.upload-images-list');
        if(imageList.length === 0) {
            $(inputFile).parent().parent().append('<div class="upload-images-list"></div>');
            imageList = $(inputFile).parent().parent().find('.upload-images-list');
        }
        const files = inputFile.files;
        const loading = [];
        for(let i = 0 ; i < files.length ; i++) {
            if (files && files[i]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imageList.append(`
                        <div class="image-file-upload-item">
                            <img src="${e.target.result}" alt="${files[i].name}" />
                        </div>
                    `);
                };
                reader.readAsDataURL(files[i]);
                loading.push(i);
                uploadFile({
                    index: i,
                    file: files[i],
                    success: (response) => {
                        loading.filter(item => item !== i);
                        $('#media_upload').append(`<input type="hidden" name="${name}" value="${response.media.id}" />`);
                    },
                    error: () => {
                        loading.filter(item => item !== i);
                    }
                });
            }
        }
    });
    $('body').on('click', '.product-gallery li', function() {
        const $this = $(this);
        const $main_image = $this.parent().parent().find('.product-image img');
        const image_src = $(this).data('src');
        $($main_image).attr('src', image_src);
    });

    $('#adminTabs .tab-pane.active').each(function(ind, el){
        if(ind !== 0) $(this).removeClass('active');
    });

    $('.stock-meta .prod_color li').on('click', function() {
        $('.stock-meta li').removeClass('active');
        $(this).addClass('active');
        const stock_id = $(this).data('stock-id');
        $('.product-images-gallery').hide();
        $('.product-price-container .product_price').hide();
        $('.product-cart-form form').hide();
        $('.stock-meta.stock-meta-size').hide();
        $('.stock-meta.stock-meta-size[data-id="'+stock_id+'"]').show();
        $('.product-cart-form form[data-stock-id="'+stock_id+'"]').show();
        $('.product-images-gallery[data-stock-id="'+stock_id+'"]').show();
        $('.product-price-container .product_price[data-stock-id="'+stock_id+'"]').show();
    });

    $('.stock-meta .prod_size li').on('click', function() {
        $('.stock-meta li').removeClass('active');
        $(this).addClass('active');
        const stock_id = $(this).data('stock-id');
        $('.product-price-container .product_price').hide();
        $('.product-cart-form form').hide();
        $('.product-cart-form form[data-stock-id="'+stock_id+'"]').show();
        $('.product-price-container .product_price[data-stock-id="'+stock_id+'"]').show();
    });

    $('.cart-quantity .cart-add, .cart-quantity .cart-remove').on('click', function(e) {
        e.preventDefault();
        let exec = true;
        const $this = $(this);
        const maxCount = $this.parent().data('max-count').toString();
        const addBtn = $this.parent().find('.cart-add');
        const removeBtn = $this.parent().find('.cart-remove');

        const quantityLabel = $this.parent().find('.cart-quantity-label');
        const priceTd = $this.parentsUntil('tr').parent().find('.td-price');
        const currentQuantity = $(quantityLabel).text();
        const currentprice = $(priceTd).text() / currentQuantity;
        // const quantityTd = $this.parentsUntil('tr').parent().find('.td-quantity');

        const url = $this.attr('href');
        const csrfToken = $('meta[name="csrf-token"]').attr('content');

        if($this.hasClass('cart-add') && maxCount === currentQuantity) exec = false;
        if($this.hasClass('cart-remove') && currentQuantity === "0") exec = false;

        if(exec) {
            $.ajax({
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: {
                    'CSRF-Token': csrfToken // <-- is the csrf token as a header
                },
                type: 'POST',
                url,
                success: (res) => {
                    let totalProductsPrice = Number($('#total-products-price').text()) - (currentprice * currentQuantity);
                    if(!res.data) {
                        $this.parentsUntil('tr').parent().remove();
                    } else {
                        const quantity = res.data.stocks[0].cartItem.quantity;
                        const price = res.data.stocks[0].price;
                        const productPrice = Number(quantity) * Number(price);
                        $(quantityLabel).text(quantity);
                        $(priceTd).text(productPrice);

                        if(maxCount === quantity.toString()) $(addBtn).addClass('disabled');
                        else $(addBtn).removeClass('disabled');

                        if(quantity.toString() === "0") $(removeBtn).addClass('disabled');
                        else $(removeBtn).removeClass('disabled');

                        totalProductsPrice += productPrice;
                    }

                    if($this.hasClass('cart-add'))
                        $('#total-all-count').text(Number($('#total-all-count').text()) + 1);
                    if($this.hasClass('cart-remove'))
                        $('#total-all-count').text(Number($('#total-all-count').text()) - 1);

                    $('#total-products-price').text(totalProductsPrice);
                    $('#total-all-tax').text((totalProductsPrice/100) * 0.9);
                    $('#total-all-price').text(totalProductsPrice + (totalProductsPrice/100) * 0.9);
                },
                error: (err) => {
                    console.log('err', err);
                },
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                timeout: 60000
            })
        }
    });

    $('#attach-details .add-attach').on('click', function() {
        const attach_detail_len = $(this).parent().find('.attach-detail').length + 1;
        let attach_detail = $(this).parent().find('.attach-detail')[0];
        attach_detail = $(attach_detail).clone();
        const last_attach_detail = $(this).parent().find('.attach-detail')[attach_detail_len-1];
        $(attach_detail).find('[name*="[stock][1]"]').each((ind, el) => {
            const item = $(el).attr('name');
            const new_item = item.replace('[1]', '['+attach_detail_len+']');
            $(el).attr('name', new_item);
        });
        $(attach_detail).find('[data-id*="[stock][1]"]').each((ind, el) => {
            const item = $(el).attr('data-id');
            const new_item = item.replace('[1]', '['+attach_detail_len+']');
            $(el).attr('data-id', new_item);
        });
        $(attach_detail).find('[for*="[1]"]').each((ind, el) => {
            const item = $(el).attr('for');
            const new_item = item.replace('[1]', '['+attach_detail_len+']');
            $(el).attr('for', new_item);
        });
        $(attach_detail).find('[id*="[1]"]').each((ind, el) => {
            const item = $(el).attr('id');
            const new_item = item.replace('[1]', '['+attach_detail_len+']');
            $(el).attr('id', new_item);
        });
        $(attach_detail).find('.js-select2-pmeta').each((ind, el) => {
            $(el).removeClass('select2-hidden-accessible');
            $(el).removeAttr('aria-hidden');
            $(el).removeAttr('tabindex');
        });
        $(attach_detail).find('.select2').each((ind, el) => {
          $(el).remove();
        });
        $(attach_detail).appendTo('#attach-details').after($(this));
        $('.js-select2-pmeta').select2({
            templateResult: formatColor
        });
    });
});

