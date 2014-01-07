package com.georgefrick.sad.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.georgefrick.fun.ClientResource;
import com.georgefrick.fun.PartsResource;
import com.georgefrick.sad.form.MainForm;

/**
 * @author gitter
 *
 * This Action handles displaying the four views in the application
 */
public class MainAction extends Action {
	private static final ClientResource clientResource = new ClientResource();
	private static final PartsResource partsResource = new PartsResource();

	@Override
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		// Fetch and default the view parameter
		String view = request.getParameter("view");
		if (view == null) {
			view = "home";
		}

		// normally, these would be separate actions to limit the amount
		// of data returned.  I'm cheating...
		MainForm mainForm = (MainForm) form;
		mainForm.setParts(partsResource.getParts());
		mainForm.setClients(clientResource.getClients());

		// Find and forward to the correct view
		return mapping.findForward(view);
	}

}
