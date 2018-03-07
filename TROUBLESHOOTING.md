# Known Issues

## Step 3 - Watson Machine Learning Service Instance has no credentials

After creating the Watson Machine Learning Service Instance, it should create a set of credentials automatically. If it does not, you will experience a 500 error when adding the Machine Learning service as an associated service in DSX (Step 5).

![ML Error][1]

As a workaround, go to your IBM Cloud Dashboard, click the Watson Machine Learning service. Click `Service credentials`.

Click the `New credential` button. give it a name or use the autopopulated one and click add. Expand `View credentials` and take note of your user name and password. You will need to enter this into DSX in Step 6.


[1]: /doc/source/images/ml-error.png?raw=true
