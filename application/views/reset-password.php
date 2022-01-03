<style type="text/css">
	.radio>label{font-size: 13px!important}
	h5.content-group-lg {
	    margin: 10px 0 0 0px;
	    font-size: 20px;
	}
	.help-tip{
	    position: relative;
	    /*top: 18px;
	    right: 18px;*/
	    text-align: center;
	    background-color: #BCDBEA;
	    border-radius: 50%;
	    width: 24px;
	    height: 24px;
	    font-size: 14px;
	    line-height: 26px;
	    cursor: default;
	}

	.help-tip:before{
	    content:'?';
	    font-weight: bold;
	    color:#fff;
	}

	.help-tip:hover p{
	    display:block;
	    transform-origin: 100% 0%;

	    -webkit-animation: fadeIn 0.3s ease-in-out;
	    animation: fadeIn 0.3s ease-in-out;

	}

	.help-tip p {
	    display: none;
	    text-align: left;
	    background-color: #1E2021;
	    padding: 15px;
	    width: 300px;
	    position: absolute;
	    border-radius: 3px;
	    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
	    right: -4px;
	    color: #FFF;
	    font-size: 12px;
	    line-height: 25px;
	    z-index: 99;
	}

	.help-tip p:before{ /* The pointer of the tooltip */
	    position: absolute;
	    content: '';
	    width:0;
	    height: 0;
	    border:6px solid transparent;
	    border-bottom-color:#1E2021;
	    right:10px;
	    top:-12px;
	}

	.help-tip p:after{ /* Prevents the tooltip from being hidden */
	    width:100%;
	    height:40px;
	    content:'';
	    position: absolute;
	    top:-40px;
	    left:0;
	}

	/* CSS animation */

	@-webkit-keyframes fadeIn {
	    0% { 
	        opacity:0; 
	        transform: scale(0.6);
	    }

	    100% {
	        opacity:100%;
	        transform: scale(1);
	    }
	}

	@keyframes fadeIn {
	    0% { opacity:0; }
	    100% { opacity:100%; }
	}
    .password-with-help-group .form-group{
        margin-bottom: 0;
    }
    .password-with-help-group{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
    }
    .flex-grow-1{
        flex-grow: 1;
    }
</style>
<section class="LoginBox">
    <form name="reset_pass_form" action="<?=base_url();?>auth/resetPassword" method="post">
        <input type="hidden" name="recovery_link" value="<?= $recovery_link ?>">
        <div class="login-form wow zoomIn">

            <div class="text-center">

                <div class="icon-object border-warning-400 text-warning-400"><i class="icon-spinner11"></i></div>

                <h5 class="content-group-lg">Reset Your Password

                    <small class="display-block">
                        <?php
                            echo validation_errors();
                            if ($this->session->flashdata('message')) {
                                echo $this->session->flashdata('message');
                            }
                        ?>
                    </small>

                </h5>

            </div>

            <div class="password-with-help-group">
                <div class="form-group has-feedback has-feedback-left flex-grow-1">

                    <input type="password" id="password" data-toggle="password" class="form-control input-lg" name="password" placeholder="Password" />

                    <div class="form-control-feedback">

                        <i class="icon-lock2 text-muted"></i>

                    </div>

                </div>
                <div class="help-tip" style="margin-left: 12px;">
                    <p>Must include at least 8 chracters <br/>Must include at least 1 uppercase letter(A-Z) <br/>Must include at least 1 lowercase letter(a-z) <br/>Must include at least 1 numeric digit(0-9) <br/>Must include at least 1 special character(!@#$%^*)</p>
                </div>
            </div>
            <div class="password-with-help-group">
                <div class="form-group has-feedback has-feedback-left flex-grow-1">

                    <input type="password" id="repassword" data-toggle="password" class="form-control input-lg" name="repassword" placeholder="Enter Confrim Password" />

                    <div class="form-control-feedback">

                        <i class="icon-lock2 text-muted"></i>

                    </div>

                </div>
                <div class="help-tip" style="margin-left: 12px;">
                    <p>Must include at least 8 chracters <br/>Must include at least 1 uppercase letter(A-Z) <br/>Must include at least 1 lowercase letter(a-z) <br/>Must include at least 1 numeric digit(0-9) <br/>Must include at least 1 special character(!@#$%^*)</p>
                </div>
            </div>
            <div class="form-group">
                <div class="custom-capcha">
                    <script src='https://www.google.com/recaptcha/api.js'></script>
                    <div class="g-recaptcha" data-sitekey="6LeMZPkUAAAAAOY59BjLyKtYXFOH3YU4QNGKWSw4"></div>
                    <div id="errormessage"></div>
                </div>
            </div>
            <div class="form-group">

                <a href="javascript:reset()" class="btn bg-slate btn-block btn-lg content-group">Reset Password <i class="icon-arrow-right14 position-right"></i></a>

            </div>

            <div class="content-divider text-muted form-group"><span>Already have an account?</span></div>

            <a href="<?= base_url('auth/login') ?>" class="btn bg-slate btn-block btn-lg content-group">Login</a>

        </div>
    </form>
</section><!--LoginBox-->
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-show-password/1.0.3/bootstrap-show-password.min.js"></script>
<script type="text/javascript">
    function reset(){
        if(grecaptcha.getResponse() == "") {
            jQuery("#errormessage").text("Please Fill The Google Captcha");
        }
        else{
            document.reset_pass_form.submit();
        }
    }
</script>