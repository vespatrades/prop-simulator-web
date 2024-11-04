# Prop Trading Simulator Web UI

A web interface for the [Prop Trading Strategy Simulator](https://github.com/razor389/prop-simulator), providing Monte Carlo simulation capabilities for evaluating prop trading account strategies.

## 🌟 Overview

The Prop Trading Simulator Web UI works in conjunction with the [Rust-based simulation backend](https://github.com/razor389/prop-simulator) to provide comprehensive prop trading strategy evaluation. This tool helps traders:

- Evaluate trading strategies using Monte Carlo simulation
- Analyze historical trading performance
- Calculate success probabilities for different prop firm challenges
- Visualize risk and reward metrics

## 🚀 Key Features

- **Strategy Simulation**
  - Parameter-based Monte Carlo simulation
  - Historical data analysis via CSV upload
  - Multiple prop firm rule sets
  - Configurable risk parameters
  - Real-time results visualization

- **Analysis Tools**
  - Detailed statistical analysis
  - Interactive visualizations
  - Performance metrics
  - Risk assessment tools
  - Profit/loss projections

- **Supported Prop Firms**
  - Fast Track Trading (FTT)
  - Topstep
  - More coming soon

## 💻 Tech Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
- **State Management**: React Hooks
- **Testing**: Vitest & Testing Library

## 🛠️ Development Setup

1. **Prerequisites**
   - Node.js 18+
   - npm 9+
   - Running instance of the [Prop Trading Simulator Backend](https://github.com/razor389/prop-simulator)

2. **Installation**
   ```bash
   # Clone repository
   git clone https://github.com/vespatrades/prop-simulator-web.git
   cd prop-simulator-web

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

   Visit `http://localhost:5173` to see the application.

## 📦 Production Setup

### Directory Structure
```
/var/www/prop-simulator-web/
├── dist/            # Frontend build output
├── logs/           # Application logs
│   ├── access.log
│   └── error.log
```

### Local Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Production Deployment
```bash
# Assuming you're in the project directory
npm run build

# Copy to production directory
sudo cp -r dist/* /var/www/prop-simulator-web/dist/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/prop-simulator-web
sudo chmod -R 755 /var/www/prop-simulator-web
```

See our comprehensive [Deployment Guide](docs/DEPLOYMENT.md) for:
- Complete stack deployment instructions
- Nginx configuration
- SSL setup
- Backend service configuration
- Security hardening
- Monitoring setup

## 🔗 Related Projects

- [Prop Trading Simulator](https://github.com/razor389/prop-simulator) - Rust backend powering the simulations

## 🛟 Support

- 🐛 Found a bug? [Open an Issue](https://github.com/vespatrades/prop-simulator-web/issues)
- 💡 Have a feature request? [Submit a Proposal](https://github.com/vespatrades/prop-simulator-web/issues/new)
- 🤔 Questions? [Discussions](https://github.com/vespatrades/prop-simulator-web/discussions)

## 🔧 Troubleshooting

1. **API Connection Issues**
   ```bash
   # Check backend service
   sudo systemctl status prop-simulator
   
   # Check logs
   sudo journalctl -u prop-simulator -f
   ```

2. **Build Issues**
   ```bash
   # Clear dependencies
   rm -rf node_modules
   npm install

   # Clear build cache
   npm run clean
   ```

3. **Common Problems**
   - CORS issues: Check Nginx configuration
   - Build failures: Verify Node.js version
   - API errors: Confirm backend is running

4. See [Deployment Guide](docs/DEPLOYMENT.md#troubleshooting) for more troubleshooting steps

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Vite](https://vitejs.dev/)
- Charts by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This project requires a running instance of the [Prop Trading Simulator Backend](https://github.com/razor389/prop-simulator) for full functionality.