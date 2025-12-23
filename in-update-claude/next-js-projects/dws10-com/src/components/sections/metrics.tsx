export function MetricsSection() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          <div>
            <div className="text-4xl font-bold">$135K</div>
            <div className="mt-2 text-blue-100">Startup Credits</div>
            <div className="mt-1 text-sm text-blue-200">AWS + Google + Groq</div>
          </div>
          <div>
            <div className="text-4xl font-bold">50</div>
            <div className="mt-2 text-blue-100">Edge Sites</div>
            <div className="mt-1 text-sm text-blue-200">NVIDIA Jetson Deployed</div>
          </div>
          <div>
            <div className="text-4xl font-bold">86%</div>
            <div className="mt-2 text-blue-100">Cost Reduction</div>
            <div className="mt-1 text-sm text-blue-200">vs AWS-only architecture</div>
          </div>
          <div>
            <div className="text-4xl font-bold">1.95</div>
            <div className="mt-2 text-blue-100">Months ROI</div>
            <div className="mt-1 text-sm text-blue-200">Hardware payback period</div>
          </div>
        </div>
      </div>
    </section>
  )
}
