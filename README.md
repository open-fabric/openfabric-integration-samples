# OpenFabric Merchant SDK

OpenFabric simplifies acceptance of closed-loop consumer side payment methods (Wallets, BNPLs, Loyalty Platforms, etc) that are integrated into OpenFabric's Platform.

While the consumer experiences with these payment methods remain the same (as if you are integrated directly with these payment methods), your integration to accept these payment methods should now be greatly simplified.

# Integration

```
<script type="module" src="https://unpkg.com/@openfabric/merchant-sdk/dist/index.umd.min.js"></script>
```

or 

```
yarn add @openfabric/merchant-sdk
```

[Check out our detailed integration guide.](https://developer.openfabric.co/ZG9jOjIzNjI1Mzcz-merchant-integration-guide)

# Local samples

1. Copy `.sample.env` to `.env` and set the correct values
2. Run `sh start.sh`
3. Check the desired scenario:
- [http://localhost:3000/](http://localhost:3000/) for the React sample application
- [http://localhost:3000/vanilla](http://localhost:3000/vanilla) for the vanilla JS application
- [http://localhost:3000/pg](http://localhost:3000/pg) for the Payment Gateway sample application
- [http://localhost:3000/pg](http://localhost:3000/backend) for the Backend flow application


# Live samples

[React sample](https://sample-merchant-flow.sandbox.openfabric.co/)

[Vanilla JS sample](https://sample-merchant-server.sandbox.openfabric.co/Prod/vanilla)

