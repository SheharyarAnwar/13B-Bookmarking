import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as appsync from "@aws-cdk/aws-appsync";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cognito from "@aws-cdk/aws-cognito";
import * as CodePipeline from "@aws-cdk/aws-codepipeline";
import * as CodePipelineAction from "@aws-cdk/aws-codepipeline-actions";
import * as CodeBuild from "@aws-cdk/aws-codebuild";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const mainHandler = new lambda.Function(this, "Bookmark-App-Sherry", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });
    const graphEndPoint = new appsync.GraphqlApi(
      this,
      "GraphEndPointSheharyarBookmark",
      {
        name: "bookmark-app-sheharyar",
        schema: appsync.Schema.fromAsset("schema/index.gql"),
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
          },
        },
        xrayEnabled: true,
      }
    );
    const table = new dynamodb.Table(this, "TableBookmarksSheharyar", {
      tableName: "bookmarks",
      partitionKey: { name: "docId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    table.grantFullAccess(mainHandler);
    mainHandler.addEnvironment("TABLE", table.tableName);
    const dataSource = graphEndPoint.addLambdaDataSource(
      "BookmarkDataSourceSheharyar",
      mainHandler
    );
    dataSource.createResolver({
      fieldName: "addBookmark",
      typeName: "Mutation",
    });
    dataSource.createResolver({
      fieldName: "bookmarks",
      typeName: "Query",
    });
    const myBucket = new s3.Bucket(this, "GATSBYbuckets", {
      versioned: true,
    });

    const dist = new cloudfront.Distribution(this, "myDistribution", {
      defaultBehavior: { origin: new origins.S3Origin(myBucket) },
      defaultRootObject: "index.html",
    });

    new s3Deployment.BucketDeployment(this, "deployStaticWebsite", {
      sources: [s3Deployment.Source.asset("../frontend/public")],
      destinationBucket: myBucket,
      distribution: dist,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: dist.domainName,
    });

    // Artifact from source stage
    const sourceOutput = new CodePipeline.Artifact();

    // Artifact from build stage
    const S3Output = new CodePipeline.Artifact();

    //Code build action, Here you will define a complete build
    const s3Build = new CodeBuild.PipelineProject(this, "s3Build", {
      buildSpec: CodeBuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            "runtime-versions": {
              nodejs: 12,
            },
            commands: ["cd frontend", "npm i -g gatsby", "npm install"],
          },
          build: {
            commands: ["gatsby build"],
          },
        },
        artifacts: {
          "base-directory": "./frontend/public",
          files: ["**/*"],
        },
      }),
      environment: {
        buildImage: CodeBuild.LinuxBuildImage.STANDARD_3_0,
      },
    });

    const policy = new PolicyStatement();
    policy.addActions("s3:*");
    policy.addResources("*");

    s3Build.addToRolePolicy(policy);

    ///Define a pipeline
    const pipeline = new CodePipeline.Pipeline(this, "GatsbyPipeline", {
      crossAccountKeys: false,
      restartExecutionOnUpdate: true,
    });

    ///Adding stages to pipeline

    //First Stage Source
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: "Checkout",
          owner: "SheharyarAnwar",
          repo: "13A-Todo-App",
          oauthToken: cdk.SecretValue.secretsManager("sherryGithubTokenName", {
            jsonField: "SHERRY_GITHUB_TOKEN",
          }),
          output: sourceOutput,
          branch: "master",
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: "s3Build",
          project: s3Build,
          input: sourceOutput,
          outputs: [S3Output],
        }),
      ],
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: "s3Build",
          input: S3Output,
          bucket: myBucket,
        }),
      ],
    });
  }
}
