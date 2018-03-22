DISCLAIMER: This application is used for demonstrative and illustrative purposes only and does not constitute an offering that has gone through regulatory review.

# Create and deploy a scoring model to predict heart failure on IBM Cloud with the Watson Data Platform

> Data Science Experience is now Watson Studio. Although some images in this code pattern may show the service as Data Science Experience, the steps and processes will still work.

In this Code Pattern, we will use a Jupyter Notebook on IBM Watson Studio to build a predictive model that demonstrates a potential health care use case.
This a customized version of the Node.js sample app that is available with the [Watson Machine Learning Service on IBM Cloud](http://www.ng.bluemix.net/docs/#services/PredictiveModeling/index.html).
See the [original app](https://github.com/pmservice/predictive-modeling-samples) for a walkthrough of the source code.

When the reader has completed this Code Pattern, they will understand how to:

* Build a predictive model within a Jupyter Notebook
* Deploy the model to IBM Watson Machine Learning service
* Access the Machine Learning model via either APIs or a Nodejs app

![](doc/source/images/architecture.png)

## Flow
1. The developer creates an IBM Watson Studio Workspace.
2. IBM Watson Studio depends on an Apache Spark service.
3. IBM Watson Studio uses Cloud Object storage to manage your data.
4. This lab is built around a Jupyter Notebook, this is where the developer will import data, train, and evaluate their model.
5. Import data on heart failure.
6. Trained models are deployed into production using IBM's Watson Machine Learning Service.
7. A Node.js web app is deployed on IBM Cloud calling the predictive model hosted in the Watson Machine Learning Service.
8. A user visits the web app, enters their information, and the predictive model returns a response.

## Included components
* [IBM Watson Studio](https://www.ibm.com/bs-en/marketplace/data-science-experience): Analyze data using RStudio, Jupyter, and Python in a configured, collaborative environment that includes IBM value-adds, such as managed Spark.
* [Jupyter Notebook](http://jupyter.org/): An open source web application that allows you to create and share documents that contain live code, equations, visualizations, and explanatory text.
* [PixieDust](https://github.com/ibm-watson-data-lab/pixiedust): Provides a Python helper library for IPython Notebook.

## Featured technologies
* [Artificial Intelligence](https://medium.com/ibm-data-science-experience): Artificial intelligence can be applied to disparate solution spaces to deliver disruptive technologies.
* [Data Science](https://medium.com/ibm-data-science-experience/): Systems and scientific methods to analyze structured and unstructured data in order to extract knowledge and insights.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.

<!--
# Watch the Video
TBD
-->

# Steps


1. [Deploy the testing application](#1-deploy-the-testing-application)
2. [Create an instance of the Watson Machine Learning Service](#2-create-an-instance-of-the-watson-machine-learning-service)
3. [Create an instance of the Watson Studio Service](#3-create-an-instance-of-the-data-science-experience-service)
4. [Create a project in IBM Watson Studio and bind it to your Watson Machine Learning service instance](#4-create-a-project-in-ibm-data-science-experience-and-bind-it-to-your-watson-machine-learning-service-instance)
5. [Save the credentials for your Watson Machine Learning Service](#5-save-the-credentials-for-your-watson-machine-learning-service)
6. [Create a notebook in IBM Watson Studio](#6-create-a-notebook-in-ibm-data-science-experience)
7. [Run the notebook in IBM Watson Studio](#7-run-the-notebook-in-ibm-data-science-experience)
8. [Deploy the saved predictive model as a scoring service](#8-deploy-the-saved-predictive-model-as-a-scoring-service)


## Prerequisites

* An [IBM Cloud Account](https://console.bluemix.net)

* An account on [IBM Watson Studio](https://dataplatform.ibm.com).

* A space in IBM Cloud US South or United Kingdom regions.

As of 2/5/2018, the Machine Learning service on IBM Cloud is only available in the US South or United Kingdom regions.

### 1. Deploy the testing application

Use Ctrl-click on the Deploy to `IBM Cloud` button below to open the deployment process in a separate tab.

  [![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM/predictive-model-on-watson-ml)

> Note:  Make sure to deploy the application to the same region and space as where the *Apache Spark* and *Cloud Object Storage* services were created when you signed up for IBM Watson Studio. Please take note of this space as later in this lab the Watson Machine Learning service needs to be deployed into the same space.

* Click on `Deploy` to deploy the application.

  ![](doc/source/images/pipeline.png?raw=true)

* A Toolchain and Delivery Pipeline will be created for you to pull the app out of Github and deploy it in to IBM Cloud. Click on the Delivery Pipeline tile to see the status of the deployment.

  ![](doc/source/images/toolchain.png?raw=true)

* Wait for the **Deploy Stage** to complete successfully.

  ![](doc/source/images/deploy-stage.png?raw=true)

### 2. Create an instance of the Watson Machine Learning Service

* In your browser go to the [IBM Cloud Dashboard](https://console.bluemix.net/dashboard/apps) and click `Catalog`.

* Search for `Machine Learning`.

  ![](doc/source/images/create-ml-instance.png?raw=true)

* Verify this service is being created in the same space as the app in Step 1.

* Click `Create`.

* On the Watson ML Dashboard select `Connections` on left menu panel, and `Create Connection`.  Select the application that you deployed earlier in Step 1 of this lab connecting this Watson ML service to the Cloud Foundry application deployed.

  ![](doc/source/images/connect-to.png?raw=true)

* Click `Restage` when you’re prompted to restage your application.

  ![](doc/source/images/restage-app.png?raw=true)

  ![](doc/source/images/connect-to-app.png?raw=true)

* Go back to the IBM Cloud dashboard and wait until the app shows that it is running again.

  ![](doc/source/images/overview-services-and-app.png?raw=true)

### 3. Create an instance of the Watson Studio Service

* In your browser go to the IBM Cloud Dashboard and click `Catalog`.

* Search for `Watson Studio`.

  ![](doc/source/images/dsx-service.png?raw=true)

* Verify this service is being created in the same space as the app in Step 2.

  ![](doc/source/images/dsx-create.png?raw=true)

* Click `Create`

### 4. Create a project in IBM Watson Studio and bind it to your Watson Machine Learning service instance

* Sign up for IBM's [Watson Studio](https://dataplatform.ibm.com). By creating a project in Watson Studio a free tier ``Object Storage`` service will be created in your IBM Cloud account. Take note of your service names as you will need to select them in the following steps.

> Note: When creating your Object Storage service, select the ``Free`` storage type in order to avoid having to pay an upgrade fee.

  ![](doc/source/images/create-services.png?raw=true)

> Note: Services created must be in the same region, and space, as your Watson Studio service.

* Enter _Watson ML Integration_ as the project name and click `Create`.

* From within the new project `Overview` panel, click `Add to project` on the top right, selecting `Data asset`.

  ![](doc/source/images/add-to-project.png?raw=true)

  A panel on the right of the screen appears, select `load` and click on `Browse` to upload the data file you'll use to create a predictive model.

  ![](doc/source/images/add-data-asset.png?raw=true)

* On your machine, browse to the location of the file **patientdataV6.csv** in this repository in the **data/** directory. Select the file and click on Open (or the equivalent action for your operating system).

* Once successfully uploaded, the file should appear in the `Data Assets` section.

  ![](doc/source/images/data-assets.png?raw=true)

* Click on `Settings` for the project.

  ![](doc/source/images/settings.png?raw=true)

* Click on add associated service and select `Machine Learning`.

  ![](doc/source/images/add-associated-service.png?raw=true)

* Choose your existing Machine Learning instance and click on `Select`.

  ![](doc/source/images/choose-ml-service.png?raw=true)

* The Watson Machine Learning service is now listed as one of your `Associated Services`.

  ![](doc/source/images/associated-services.png?raw=true)

* Leave the browser tab open for later.

### 5. Save the credentials for your Watson Machine Learning Service

* In a different browser tab go to [http://console.bluemix.net](http://console.bluemix.net) and log in to the Dashboard.

* Click on your Watson Machine Learning instance under `Services`.

  ![](doc/source/images/services-overview.png?raw=true)

* Click on `Service credentials` and then on `View credentials` to see the credentials.

  ![](doc/source/images/ml-credentials.png?raw=true)

* Save the username, password and instance_id to a text file on your machine. You’ll need this information later in your Jupyter notebook.

### 6. Create a notebook in IBM Watson Studio

* In [Watson Studio](https://dataplatform.ibm.com), click on `Create notebook` to create a notebook.
* Create a project if necessary, provisioning an object storage service if required.
* In the `Assets` tab, select the `Create notebook` option.
* Select the `From URL` tab.
* Enter a name for the notebook.
* Optionally, enter a description for the notebook.
* Under `Notebook URL` provide the following url: https://github.com/IBM/predictive-model-on-watson-ml/blob/master/demo1.ipynb
* Select the free Anaconda runtime.
* Click the `Create` button.

  ![](doc/source/images/create-notebook.png?raw=true)

### 7. Run the notebook in IBM Watson Studio

* Place your cursor in the first code block in the notebook.

  ![Insert Spark Data Frame Step 1](doc/source/images/Picture23.png)

* Click on the `Find and Add` data icon -- see step 1 in diagram below -- and then select `Insert to code` under the file **patientdataV6.csv**. This is step 2 in diagram below. Finally select `Insert Spark Data Frame` -- which is step 3 in diagram below.

  ![](doc/source/images/insert-credentials2.png?raw=true)

> Note:  Make sure to rename the variable to `df_data` and add `.option('inferSchema','True')\`.

  ![Insert Spark Data Frame Step 3](doc/source/images/Picture25.png)

* Click on the `Run` icon to run the code in the cell.

  ![](doc/source/images/run-notebook.png?raw=true)

* Move your cursor to each code cell and run the code in it. Read the comments for each cell to understand what the code is doing. **Important** when the code in a cell is still running, the label to the left changes to **In [\*]**:.
  Do **not** continue to the next cell until the code is finished running.

* When you get to the cell that says `Stop here !!!!` insert the username and password that you saved from your Watson Machine Learning instance into the code before running it.

  ![Run Notebook](doc/source/images/Picture27.png)

* Continue running each cell until you finish the entire notebook.

### 8. Deploy the saved predictive model as a scoring service

* In a different browser tab go to [http://console.bluemix.net](http://console.bluemix.net) and log in to your dashboard.

* Click on the entry for your Watson Machine Learning service under `Services`.

* Click `Manage` and then click on the `Launch Dashboard` button in the Watson Machine Learning tile.

![](doc/source/images/launch-dashboard.png?raw=true)

* Your saved model should appear. Under `Actions` select `Create Deployment`.

![](doc/source/images/create-deployment1.png?raw=true)

* Name the deployment _Heart Failure Prediction Model Deployment_ and click `Save`. Keep the type of deployment set to the default value 'Online'.

![](doc/source/images/create-deployment2.png?raw=true)

* Your model should now be deployed and visible as a Deployment with status 'ACTIVE'.

![](doc/source/images/create-deployment3.png?raw=true)

* Restart the Node.js Web App. For this, return to your IBM Cloud Dashboard and select the restart icon to restart the web application.

![](doc/source/images/restart-app.png?raw=true)

# Sample Output

* Click on the application URL to open the application in a separate tab.

![](doc/source/images/open-app.png?raw=true)

* When the application appears click on `Score now` to test the scoring model with the default values.

* Verify that the model predicts that there is a risk of heart failure for the patient with these medical characteristics.

![](doc/source/images/failure-yes.png?raw=true)

* `Click Close`. Run the app again with the following parameters.

![Score](doc/source/images/Picture33.png)

* Verify that the model predicts that there is not a risk of heart failure for the patient with these medical characteristics.

![](doc/source/images/failure-no.png?raw=true)

# Troubleshooting


# Privacy Notice
If using the `Deploy to IBM Cloud` button some metrics are tracked, the following
information is sent to a [Deployment Tracker](https://github.com/IBM/cf-deployment-tracker-service) service
on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Application GUID (`application_id`)
* Application instance index number (`instance_index`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Cloud and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Cloud to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

To disable tracking, simply remove ``require("cf-deployment-tracker-client").track();`` from the ``app.js`` file in the top level directory.

# Learn more

* **Artificial Intelligence Code Patterns**: Enjoyed this Code Pattern? Check out our other [AI Code Patterns](https://developer.ibm.com/code/technologies/artificial-intelligence/).
* **Data Analytics Code Patterns**: Enjoyed this Code Pattern? Check out our other [Data Analytics Code Patterns](https://developer.ibm.com/code/technologies/data-science/)
* **AI and Data Code Pattern Playlist**: Bookmark our [playlist](https://www.youtube.com/playlist?list=PLzUbsvIyrNfknNewObx5N7uGZ5FKH0Fde) with all of our Code Pattern videos
* **With Watson**: Want to take your Watson app to the next level? Looking to utilize Watson Brand assets? [Join the With Watson program](https://www.ibm.com/watson/with-watson/) to leverage exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.
* **Watson Studio**: Master the art of data science with IBM's [Watson Studio](https://dataplatform.ibm.com/)
* **Spark on IBM Cloud**: Need a Spark cluster? Create up to 30 Spark executors on IBM Cloud with our [Spark service](https://console.bluemix.net/catalog/services/apache-spark)

# License
[Apache 2.0](LICENSE)
