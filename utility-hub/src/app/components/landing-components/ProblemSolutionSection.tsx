
export default function ProblemSolutionSection() {
    return (
        <div className="flex flex-col lg:flex-row items-center mt-20">
            {/* Left Section: The Problem */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-orange-600 mb-6">
                The Problem
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-orange-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">warning</span>
                  </div>
                  <p className="text-orange-800">Single Points of Failure</p>
                </div>
                <div className="flex items-center gap-4 bg-orange-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">data_loss</span>
                  </div>
                  <p className="text-orange-800">Silent Data Modification</p>
                </div>
                <div className="flex items-center gap-4 bg-orange-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">platform</span>
                  </div>
                  <p className="text-orange-800">Platform Dependency</p>
                </div>
                <div className="flex items-center gap-4 bg-orange-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-orange-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">lock</span>
                  </div>
                  <p className="text-orange-800">Unreliable Long-Term Access</p>
                </div>
              </div>
            </div>

            {/* Right Section: The Solution */}
            <div className="lg:w-1/2 text-center lg:text-left mt-10 lg:mt-0">
              <h2 className="text-3xl font-bold text-teal-600 mb-6">The Solution</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-teal-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-teal-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">decentralization</span>
                  </div>
                  <p className="text-teal-800">No Central Authority</p>
                </div>
                <div className="flex items-center gap-4 bg-teal-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-teal-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">encryption</span>
                  </div>
                  <p className="text-teal-800">Resistant to Censorship</p>
                </div>
                <div className="flex items-center gap-4 bg-teal-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-teal-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">verified</span>
                  </div>
                  <p className="text-teal-800">Verifiable Integrity</p>
                </div>
                <div className="flex items-center gap-4 bg-teal-100 rounded-lg p-4 shadow-md">
                  <div className="h-12 w-12 bg-teal-300 rounded-full flex items-center justify-center">
                    <span className="material-icons text-white">permanence</span>
                  </div>
                  <p className="text-teal-800">Long-Term Permanence</p>
                </div>
              </div>
            </div>

          </div>
    );
}