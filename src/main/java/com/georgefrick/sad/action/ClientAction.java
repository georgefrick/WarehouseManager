package com.georgefrick.sad.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import com.georgefrick.fun.Client;
import com.georgefrick.fun.ClientResource;
import com.georgefrick.sad.form.MainForm;

/**
 * @author gitter
 * 
 * This Action handles CRUD actions on the Client objects
 */
public class ClientAction extends Action {
	private static final ClientResource resource = new ClientResource();
	
	@Override
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		String action = request.getParameter("action");
		
		if (action.equals("save")) {
			// parse the client 
			Client client = MainForm.parseClient(request.getParameterMap());
			
			// save the client
			
			resource.createClient(client);
		} else if (action.equals("delete")) {
			// get the id
			String id = request.getParameter("id");
			
			// delete the client
			resource.deleteClient(Long.parseLong(id));
		}
		
		// redirect the user back to the clients view
		return mapping.findForward("clients");
	}
}
